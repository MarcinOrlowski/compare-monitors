/*
** Compare Monitors utility
**
** @author    Marcin Orlowski <mail (#) marcinOrlowski (.) com>
** @copyright 2020-2025 Marcin Orlowski
** @license   http://www.opensource.org/licenses/mit-license.php MIT
** @link      https://github.com/MarcinOrlowski/compare-monitors
*/

const colors = [
	"#fbc02d",
	"#512da8",
	"#2A9D8F",
	"#8bc34a",
	"#166a88",
	"#E76F51",
	"#881616",
	"#264653",
	"#3a86ff",
	"#e2279b",
];

let monitors = new Map();
let manualScaleRatio = null; // Manual override for scale ratio

/**
 * Recalculates and updates positions for all visible monitor labels
 */
function recalculateAllLabelPositions(specs_key, gfx_divider) {
    // Wait a tiny bit for visibility changes to take effect
    setTimeout(() => {
        $('.area:visible').each(function() {
            const monitorDiv = $(this);
            const id = monitorDiv.attr('id').replace('gfx_', '');
            const monitor = monitors.get(id);
            if (monitor) {
                const top_pos = findLabelPosition(id, monitor, gfx_divider);
                $(`#gfx_${id}_label_top`).css("top", top_pos + "px");
            }
        });
    }, 50);
}

/**
 * Find optimal label position considering overlaps
 * @param {string} id Current monitor ID
 * @param {object} currentMonitor Current monitor data
 * @param {number} gfx_divider Scale ratio
 * @returns {number} Optimal vertical position for label
 */
function findLabelPosition(id, currentMonitor, gfx_divider) {
    const LABEL_HEIGHT = 24;
    const LABEL_PADDING = 2;

    // Get all visible monitor divs
    const visibleDivs = $('.area:visible').not(`#gfx_${id}`);
    const currentDiv = $(`#gfx_${id}`);

    if (!currentDiv.length) return 0;

    const currentBox = {
        left: currentDiv.offset().left,
        right: currentDiv.offset().left + currentDiv.width(),
        top: currentDiv.offset().top
    };

    // Find monitors that overlap horizontally
    const overlappingLabels = [];
    visibleDivs.each(function() {
        const otherDiv = $(this);
        const otherLeft = otherDiv.offset().left;
        const otherRight = otherLeft + otherDiv.width();

        // Check horizontal overlap
        if (!(currentBox.right < otherLeft || currentBox.left > otherRight)) {
            const labelDiv = otherDiv.find('.label.top.right');
            if (labelDiv.length) {
                overlappingLabels.push(labelDiv.offset().top);
            }
        }
    });

    // Start with the monitor's top position
    let position = currentBox.top;

    // Sort existing positions
    overlappingLabels.sort((a, b) => a - b);

    // Find first available gap
    for (const existingPos of overlappingLabels) {
        if (Math.abs(position - existingPos) < LABEL_HEIGHT + LABEL_PADDING) {
            position = existingPos + LABEL_HEIGHT + LABEL_PADDING;
        }
    }

    return Math.max(0, position - currentBox.top);
}

// Set to FALSE to show monitor index instead of label
let show_label = true;

/**
 * Calculates overlay scale ratio, depending on width of container
 * div and max width of the element to be drawn. Returns X as in
 * 1:X scale (i.e. 2 means scale ratio 1:2).
 *
 * @param key Source data key: "resolution" or "display"
 *
 * @returns {number}
 */
function getScaleRatio(key) {
	// If manual scale ratio is set, use it
	if (manualScaleRatio !== null) {
		return manualScaleRatio;
	}

	let max_width = 0;
	for (const element of monitors_src) {
		let monitor = element;
		// Only consider enabled/checked monitors
		if (isChecked(monitor) && monitor[key]["w"] > max_width) {
			max_width = monitor[key]["w"];
		}
	}

	// If no monitors are enabled, use the original behavior
	if (max_width === 0) {
		for (const element of monitors_src) {
			let monitor = element;
			if (monitor[key]["w"] > max_width) {
				max_width = monitor[key]["w"];
			}
		}
	}

	let div_width = Math.round($("#gfx").width());
	let ratio = Math.round((max_width / div_width) + 0.5);
	if (ratio < 1) {
		ratio = 1;
	}
	return ratio;
}

/**
 * comparator, sorting by display width, DESC
 *
 * @param key Source data key: "resolution" or "display"
 * @param a   Monitor A
 * @param b   Monitor B
 *
 * @returns {number}
 */
function widthComparator(key, a, b) {
	// Use toUpperCase() to ignore character casing
	let comparison = 0;
	if (a[key]["w"] < b[key]["w"]) {
		comparison = 1;
	} else if (a[key]["w"] > b[key]["w"]) {
		comparison = -1;
	}
	return comparison;
}

function displayWidthComparator(a, b) {
	return widthComparator("display", a, b);
}

function resolutionWidthComparator(a, b) {
	return widthComparator("resolution", a, b);
}

function generateId(monitor) {
	return monitor["label"].toLowerCase().replace(/[\W_]+/g, "_");
}

/**
 * Returns true if monitor is checked (enabled) on page load.
 * @param {object} monitor
 * @returns {boolean}
 */
function isChecked(monitor) {
	let val = monitor.hasOwnProperty("checked") ? monitor['checked'] : false;
	console.log(JSON.stringify(monitor));
	console.log(JSON.stringify(val));
	return val;
}

/**
 * Returns true if monitor is curved, false otherwise.
 *
 * @param {object} monitor
 * @returns {boolean}
 */
function isCurvedMonitor(monitor) {
	return monitor.hasOwnProperty("curved") ? monitor['curved'] : false;
}

/**
 * Formats monitor label, optionally adding curved indicator. Note it can return HTML formatted string.
 *
 * @param {object} monitor data
 * @returns {string} formatted label to be displayed. Can contain HTML.
 */
function getMonitorLabel(monitor){
	let label = monitor["label"];
	if (isCurvedMonitor(monitor)) {
		label += ' 🖵';
		label = `<span class="curved">${label}</span>`;
	}

	return label;
}

function createOverlays(specs_key) {
	// sort by display specs
	switch (specs_key) {
		case "display":
			monitors_src.sort(displayWidthComparator);
			break;

		case "resolution":
			monitors_src.sort(resolutionWidthComparator);
			break;
	}

	let gfx_divider = getScaleRatio(specs_key);

	$("#gfx_ratio").html(`Scale ratio: <b>1:${gfx_divider}</b>`);

	// generate Ids
	let monitors_tmp = new Map();
	for (let index = 0; index < monitors_src.length; index++) {
		let monitor = monitors_src[index];
		monitor["z-index"] = index;

		let id = generateId(monitor);
		monitors_tmp.set(id, monitor);
	}

	// sort by label, but as we have id based on label, we sort by id for the same effect.
	monitors = new Map([...monitors_tmp.entries()].sort());

	$("#labels").empty();
	$("#gfx").empty();

	// Enumerate monitors
	let idx = 1;
	for (let [id, monitor] of monitors) {
		monitor["index"] = idx++;
		monitors[id] = monitor;
	}

	for (let [id, monitor] of monitors) {
		let bg_color = colors[monitor["z-index"] % colors.length] + "aa";
		let border_color = colors[monitor["z-index"] % colors.length] + "22";
		let css = [
			"position: absolute",
			"z-index: " + monitor["z-index"],
			"background-color: " + bg_color,
			"border: 3px solid " + border_color,
			"width: " + monitor[specs_key]["w"] / gfx_divider + "px",
			"height: " + monitor[specs_key]["h"] / gfx_divider + "px",
		].join("; ") + ";";

		// Create monitor rectangle without label
		let gfx_div = `<div id="gfx_${id}" class="area" style="${css}"></div>`;

		$("#gfx").append(gfx_div);
		$(`#gfx_${id}`).toggle(isChecked(monitor));

		let specs = `${monitor[specs_key]["w"]}x${monitor[specs_key]["h"]}`;
		switch (specs_key) {
			case "display":
				specs += "mm";
				break;
			case "resolution":
				specs += `px @${monitor[specs_key]["freq"]}Hz`;
				break;
		}

		let checked = isChecked(monitor) ? 'checked="checked"' : "";
		let grayscale_level = isChecked(monitor) ? '0.0' : '1.0';
		let item_index = show_label ? '' : `${monitor["index"]}: `;
		let list_id = `list_${monitor["model"]}`;
		let item_label = getMonitorLabel(monitor);
		let label_div = `
			<div id="${list_id}" class="monitor-item" style="background-color: ${bg_color}; filter: grayscale(${grayscale_level})">
				<div class="monitor-checkbox">
					<input type="checkbox" id="${id}" ${checked}>
				</div>
				<label for="${id}" class="monitor-details">
					<div class="monitor-name">
						${item_index}${item_label}
						<span class="monitor-links">
							<a target="_blank" href="https://www.displayspecifications.com/en/model/${monitor["model"]}" title="View specifications">📊</a>
							<a href="#" onclick="showThumbnail('${id}');" title="Show thumbnail">🖼️</a>
						</span>
					</div>
					<div class="monitor-specs">${specs}</div>
				</label>
			</div>`;
		$("#labels").append(label_div);

		// add handler reacting to hoover on the div
		$(`#${list_id}`).on( "mouseenter", function () {
				if (isChecked(monitor)) {
					$(`#${list_id}`).css("filter", "brightness(150%)");
				}
				$(`.area`).css("filter", "brightness(50%)").css("opacity", "0.5").css("filter", "grayscale(1)");
				$(`#gfx_${id}`).css("filter", "brightness(150%)").css("opacity", "1.0").css("filter", "grayscale(0)");
			})
			.on( "mouseleave", function () {
				if (isChecked(monitor)) {
					$(`#${list_id}`).css("filter", "brightness(100%)");
				}
				$(`.area`).css("filter", "brightness(100%)").css("opacity", "1.0").css('filter', "grayscale(0)");
			});

		// checkbox state change handling
		$(`#${id}`).change(function () {
			let id = $(this).attr("id");
			let monitor = monitors.get(id);
			monitor["checked"] = !monitor["checked"];
			monitors.set(id, monitor);
			$(`#gfx_${id}`).toggle();

			let grayscale_level = isChecked(monitor) ? '0.0' : '1.0';
			$(`#${list_id}`).css('filter', `grayscale(${grayscale_level})`);

			// Recalculate scale ratio and redraw everything
			createOverlays(specs_key);
		});
	}

	// Draw all monitor labels at the end so they appear on top
	for (let [id, monitor] of monitors) {
		if (isChecked(monitor)) {
			let label = show_label
				? getMonitorLabel(monitor)
				: monitor["index"];

			let label_div = `<div id="gfx_${id}_label_top" class="label top right">${label}</div>`;
			$(`#gfx_${id}`).append(label_div);

			let top_pos = findLabelPosition(id, monitor, gfx_divider);
			$(`#gfx_${id}_label_top`).css({"top": top_pos});
		}
	}
}

function showThumbnail(id) {
	let monitor = monitors.get(id);
	let url = `https://www.displayspecifications.com/images/model/${monitor["model"]}/320/main.jpg`;
	$("#thumbnail_img").attr("src", url);
	$("#thumbnail").show();

	return true;
}

function hideThumbnail() {
	$("#thumbnail").hide();
}

$(document).ready(function () {
		hideThumbnail();

		let type = $("#type").val();
		createOverlays(type);

		// redraw on browser window size change
		$(window).resize(function() {
			// Clear manual scale override when window is resized
			manualScaleRatio = null;
			let type = $("#type").val();
			createOverlays(type);
		});

		// redraw on graphs type change
		$("#type").change(function () {
			createOverlays(this.value);
		});

		// toggle/all on/all off switches
		$("#all_toggle").on("click", function () {
			$("#labels input[type=checkbox]").each(function () {
				$(this).prop("checked", !($(this).prop("checked") == true));
				$(this).trigger("change");
			});
		});

		$("#all_off").on("click", function () {
			$("#labels input[type=checkbox]").each(function () {
				if ($(this).prop("checked")) {
					$(this).prop("checked", false);
					$(this).trigger("change");
				}
			});
		});

		$("#all_on").on("click", function () {
			$("#labels input[type=checkbox]").each(function () {
				if (!$(this).prop("checked")) {
					$(this).prop("checked", true);
					$(this).trigger("change");
				}
			});
		});

		// Manual scale control buttons
		$("#scale_up").on("click", function () {
			let currentRatio = getScaleRatio($("#type").val());
			if (currentRatio > 1) {
				manualScaleRatio = currentRatio - 1;
				let type = $("#type").val();
				createOverlays(type);
			}
		});

		$("#scale_down").on("click", function () {
			let currentRatio = getScaleRatio($("#type").val());
			manualScaleRatio = currentRatio + 1;
			let type = $("#type").val();
			createOverlays(type);
		});
	}
);
