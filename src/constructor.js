"use strict";

const fs = require("fs");
const jimp = require("jimp");
const Svg = require("./svg");
const error = require("./error");
const Option = require("./option");
const is = require("oslllo-validator");
const Processor = require("./processor");
const { AUTO, FORMATS } = require("./constants");

const Svg2 = function (input) {
	if (!(this instanceof Svg2)) {
		return new Svg2(input);
	}
	input = this.check(input);
	this.options = new Option();
	this.input = {
		string: input,
		element: null,
	};
	this.output = {
		file: undefined,
		format: undefined,
        resize: undefined,
        extend: undefined,
        background: undefined
	};
	this.jimp = jimp;
	this.svg = new Svg(this);
	this.processor = new Processor(this);
	return this;
};

Svg2.prototype = {
	check: function (input) {
		if (arguments.length === 1 && !is.defined(input)) {
			throw error.invalidParameterError(
				"input",
				"SVG string or SVG string in a buffer",
				input
			);
		}
		if (!is.buffer(input) && !is.string(input)) {
			throw error.invalidParameterError(
				"input",
				"SVG string or SVG string in a buffer",
				input
			);
		}
		if (is.buffer(input)) {
			input = Buffer.from(input).toString();
		}
		if (is.pathToFile(input)) {
			input = fs.readFileSync(input, "utf-8");
		}
		if (!is.svg(input)) {
			throw error.invalidParameterError("input", "valid SVG", `invalid SVG: ${input}`);
		}
		return input;
	},
};

Svg2.AUTO = AUTO;
Svg2.BMP = FORMATS.bmp
Svg2.PNG = FORMATS.png
Svg2.TIFF = FORMATS.tiff
Svg2.JPEG = FORMATS.jpeg

module.exports = Svg2;
