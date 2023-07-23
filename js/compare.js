/*
** Compare Monitors utility
**
** @author    Marcin Orlowski <mail (#) marcinOrlowski (.) com>
** @copyright 2020-2023 Marcin Orlowski
** @license   http://www.opensource.org/licenses/mit-license.php MIT
** @link      https://github.com/MarcinOrlowski/compare-monitors
*/

const colors = [
	"#fbc02d",
	"#512da8",
	"#8bc34a",
	"#166a88",
	"#67342f",
	"#19dc19",
	"#881616",
	"#e2279b"
];

let monitors = new Map();

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
	let max_width = 0;
	for (let index = 0; index < monitors_src.length; index++) {
		let monitor = monitors_src[index];
		if (monitor[key]["w"] > max_width) {
			max_width = monitor[key]["w"];
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
	monitors_tmp = new Map();
	for (let index = 0; index < monitors_src.length; index++) {
		let monitor = monitors_src[index];
		monitor["z-index"] = index;

		if (!monitor.hasOwnProperty("checked")) {
			monitor["checked"] = true;
		}

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
		border_color = "#ff0000";
		let css = [
			"position: absolute",
			"z-index: " + monitor["z-index"],
			"background-color: " + bg_color,
			"border: 4px solid " + border_color,
			"width: " + monitor[specs_key]["w"] / gfx_divider + "px",
			"height: " + monitor[specs_key]["h"] / gfx_divider + "px",
		].join("; ") + ";";

		let label = monitor[show_label ? "label" : "index"];
		let gfx_div = `<div id="gfx_${id}" style="${css}">
			<div id="gfx_${id}_label_top" class="label top right">${label}</div>
		</div>`;

		$("#gfx").append(gfx_div);
		let top_pos = (monitor['index'] - 1) * 30;
		$(`#gfx_${id}_label_top`).css({"top": top_pos});
		$(`#gfx_${id}`).toggle(monitor["checked"]);

		let specs = `${monitor[specs_key]["w"]}x${monitor[specs_key]["h"]}`;
		switch (specs_key) {
			case "display":
				specs += "mm";
				break;
			case "resolution":
				specs += `px @${monitor[specs_key]["freq"]}`;
				break;
		}

		let checked = monitor["checked"] ? 'checked="checked"' : "";
		let itemIndex = show_label ? '' : `${monitor["index"]}: `;
		let label_div = `
				<div style="background-color: ${bg_color}">
				<input type="checkbox" id="${id}" ${checked}>
				<label for="${id}">
					${itemIndex}${monitor["label"]}
						<a target="_blank" href="https://www.displayspecifications.com/en/model/${monitor["model"]}">Specs</a>
						<a href="#" onclick="showThumbnail('${id}');">Thumb</a>
					<br />${specs}
				</label>
			</div>`;
		$("#labels").append(label_div);

		// checkbox state change handling
		$(`#${id}`).change(function () {
			let id = $(this).attr("id");
			let monitor = monitors.get(id);
			monitor["checked"] = !monitor["checked"];
			monitors.set(id, monitor);
			$(`#gfx_${id}`).toggle();
		});
	}
}

function showThumbnail(id) {
	let monitor = monitors.get(id);
	let url = `https://www.displayspecifications.com/images/model/${monitor["model"]}/320/main.jpg`;
	$("#thumbnail").attr("src", url);

	return true;
}

$(window).on("load", function () {
		let type = $("#type").val();
		createOverlays(type);

		// redraw on browser window size change
		$(window).resize(function() {
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
	}
);

