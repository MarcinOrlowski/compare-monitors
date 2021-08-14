/*
** Compare Monitors utility
**
** @author    Marcin Orlowski <mail (#) marcinOrlowski (.) com>
** @copyright 2020-2021 Marcin Orlowski
** @license   http://www.opensource.org/licenses/mit-license.php MIT
** @link      https://github.com/MarcinOrlowski/compare-monitors
*/

let monitors_src = [
	{
		label: "Dell U4021QW",
		// displayspecifications.com' model ID
		model: "81f222f6",
		// **Display** width/height (w/o stand) in millimeters (round up)
		display: {w: 947, h: 419},
		// Screen native resolution (in pixels) and refresh frequency (in Hz)
		resolution: {w: 5120, h: 2160, freq: 60},
	},
	{
		label: "Dell U3818DW",
		model: "1e7dca5",
		display: {w: 880, h: 367},
		resolution: {w: 3840, h: 1600, freq: 60},
	},
	{
		label: "Dell U4021QW",
		model: "81f222f6",
		display: {w: 947, h: 457},
		resolution: {w: 5120, h: 2160, freq: 60},
	},
	{
		label: "LG 38WN75C",
		model: "74321f28",
		display: {w: 879, h: 366},
		resolution: {w: 3840, h: 1600, freq: 75},
		checked: false,
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
		checked: false,
	},
	{
		label: "Dell U3219Q",
		model: "b96b14f5",
		display: {w: 713, h: 415},
		resolution: {w: 3840, h: 2160, freq: 60},
	}
];

