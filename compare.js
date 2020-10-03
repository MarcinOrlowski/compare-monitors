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

let monitors_src = [
    {
        label: "Dell U3818DW",
        model: "1e7dca5",
        display: {w: 880, h: 367},
        resolution: {w: 3840, h: 1600, freq: 60},
    },
    {
        label: "LG 38WN75C",
        model: "74321f28",
        display: {w: 879, h: 366},
        resolution: {w: 3840, h: 1600, freq: 75},
    },
    {
        label: "LG 34WK95U (5K2K)",
        model: "65301459",
        display: {w: 794, h: 340},
        resolution: {w: 5120, h: 2160, freq: 60},
        checked: false,
    },
    {
        label: "MSI PS341WU HDR (5K2K)",
        model: "ac6c1b53",
        display: {w: 799, h: 336},
        resolution: {w: 5120, h: 2160, freq: 60},
        checked: false,
    },
    {
        label: "Samsung LU32J590",
        model: "5c6f1324",
        display: {w: 698, h: 392},
        resolution: {w: 3840, h: 2160, freq: 60},
    },
    {
        label: "Dell U3219Q",
        model: "b96b14f5",
        display: {w: 713, h: 415},
        resolution: {w: 3840, h: 2160, freq: 60},
    }
];

let monitors = new Map();

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

        let gfx_div = `<div id="gfx_${id}" style="${css}"></div>`;
		if (monitor["checked"]) {
        	$("#gfx").append(gfx_div);
		}

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
        let label_div = `
                <div style="background-color: ${bg_color}">
                <input type="checkbox" id="${id}" ${checked}>
                <label for="${id}">
                    ${monitor["label"]}: ${specs}
                    <a target="_blank" href="https://www.displayspecifications.com/en/model/${monitor["model"]}">Specs</a>
                    <a href="#" onclick="showThumbnail('${id}');">Thumb</a>
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
alert(id);
    let monitor = monitors.get(id);
	alert(monitor);
    let url = `https://www.displayspecifications.com/images/model/${monitor["model"]}/320/main.jpg`;
    $("#thumbnail").attr("src", url);
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
