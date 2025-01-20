/*
** Compare Monitors utility
**
** @author    Marcin Orlowski <mail (#) marcinOrlowski (.) com>
** @copyright 2020-2023 Marcin Orlowski
** @license   http://www.opensource.org/licenses/mit-license.php MIT
** @link      https://github.com/MarcinOrlowski/compare-monitors
*/

let monitors_src = [
	{
		label: "Dell U4021QW",
		// Model ID as used in https://www.displayspecifications.com/
		// In general it's part of the URL -> https://www.displayspecifications.com/en/model/<MODEL>
		model: "81f222f6",
		// **Display** width/height (w/o stand) in millimeters (round up)
		display: {w: 947, h: 419},
		// Screen native resolution (`w`, `h` in pixels) and max refresh `freq`uency (in Hz)
		resolution: {w: 5120, h: 2160, freq: 60},
		// Shall this monitor be listed as "enabled" on load? (default: false)
		checked: true,
		// Is the monitor display curved (default: false)
		curved: true,
	},
	{
		label: "Samsung Odyssey Neo G9 Dual",
		model: "4a8d34fb",
		display: {w: 1394, h:392},
		resolution: {w:7680, h:2160, freq: 240},
		curved: true,
	},
	{
		label: "BenQ PD3420Q",
		model: "b8ce1c50",
		display: {w: 826, h:372},
		resolution: {w:3440, h:1440, freq: 60},
	},
	{
		label: "Dell S3221QS 4K",
		model: "795c2136",
		display: {w: 697, h:392},
		resolution: {w:3840, h:2160, freq: 60},
		curved: true,
	},
	{
		label: "Dell U3818DW",
		model: "1e7dca5",
		display: {w: 880, h: 367},
		resolution: {w: 3840, h: 1600, freq: 60},
		checked: true,
		curved: true,
	},
	{
		label: "LG 38WN75C",
		model: "74321f28",
		display: {w: 879, h: 366},
		resolution: {w: 3840, h: 1600, freq: 75},
	},
	{
		label: "LG 34WK95U 5K",
		model: "65301459",
		display: {w: 794, h: 340},
		resolution: {w: 5120, h: 2160, freq: 60},
	},
	{
		label: "MSI PS341WU HDR 5K",
		model: "ac6c1b53",
		display: {w: 799, h: 336},
		resolution: {w: 5120, h: 2160, freq: 60},
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
		checked: true,
	},
	{
		label: "Dell U2720Q",
		model: "11f01cd5",
		display: {w: 611, h: 356},
		resolution: {w: 3840, h: 2160, freq: 75},
	},
	{
		label: "Dell U2421DC",
		model: "77151d40",
		display: {w: 527, h: 296},
		resolution: {w: 2560, h: 1440, freq: 60},
	},

];

