"use strict";

const jimp = require("jimp");

const toPx = function (input) {
	if (!input && typeof input != "string" && typeof input != "number") {
		throw TypeError(
			`input should be of type string or number, ${typeof input}, given`
		);
	}
	var units = ["rem", "px", "em"];
	for (var i = 0; i < units.length; i++) {
		var unit = units[i];
		if (input.search(unit) !== -1) {
			input = input.replace(unit, "");
			if (unit === "px") {
				break;
			} else if (unit === "em" || unit === "rem") {
				input = input * 16;
				break;
			}
		}
	}
	return Number(input);
};

const setOptions = function (preset, options = {}) {
	if (preset == undefined || preset.constructor.name !== "Object") {
		throw TypeError(
			`preset parameter should be an object, ${typeof preset}, given`
		);
	}
	if (options == undefined || options.constructor.name !== "Object") {
		throw TypeError(
			`options parameter should be an object, ${typeof options}, given`
		);
	}
	for (var option in preset) {
		if (options[option]) {
			preset[option] = options[option];
		}
	}
	return preset;
};

const blankImage = function (dimensions, background = "ffffff") {
	return new Promise((resolve, reject) => {
		var preset = { width: 1, height: 1 };
		dimensions = this.setOptions(preset, dimensions);
		new jimp(dimensions.width, dimensions.height, background, (err, image) => {
			err ? reject(err) : resolve(image);
		});
	});
};

module.exports = {
	toPx: toPx,
	setOptions: setOptions,
	blankImage: blankImage,
};
