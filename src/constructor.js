"use strict";

const fs = require("fs");
const jimp = require("jimp");
const Svg = require("./svg");
const error = require("./error");
const is = require("./validate");
const Option = require("./option");
const Processor = require("./processor");
const constants = require("./constants");

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
	};
	this.jimp = jimp;
	this.svg = new Svg(this);
	this.processor = new Processor(this);
	return this;
};

Svg2.prototype = {
	blank: function (dimensions, background = "ffffff") {
		return new Promise((resolve, reject) => {
			if (!is.defined(dimensions) || dimensions.constructor.name !== "Object") {
				throw error.invalidParameterError("input", "object", dimensions);
			}
			this.options.update("blank", dimensions);
			dimensions = this.options.get("blank");
			new jimp(
				dimensions.width,
				dimensions.height,
				background,
				(err, image) => {
					err ? reject(err) : resolve(image);
				}
			);
		});
	},
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
			throw error.invalidParameterError("input", "valid SVG", "invalid SVG");
		}
		return input;
	},
};

Svg2.AUTO = constants.AUTO;

module.exports = Svg2;
