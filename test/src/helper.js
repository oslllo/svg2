"use strict";

const fs = require("fs");
const path = require("path");
const Svg2 = require("../..");

const path2 = {
	svgs: path.resolve("test/assets/svgs"),
	resized: path.resolve("test/assets/resized"),
	exported: path.resolve("test/assets/exported"),
	expected: path.resolve("test/assets/expected"),
	converted: path.resolve("test/assets/converted"),
};

var instance = Svg2(path.join(path2.svgs, "normal.svg"));
var svg = instance.svg;

var inputs = {
	// get valid input object
	valid: function (data) {
		if (!Array.isArray(data)) {
			throw new TypeError(`data should be an array, ${typeof data} given`);
		}
		return this.data.filter((input) => {
			switch (true) {
				case data.includes(input.name):
					return true;
					break;
			}
		});
	},
	// get invalid input objects
	invalid: function (data) {
		if (!Array.isArray(data)) {
			throw new TypeError(`valid should be an array, ${typeof data} given`);
		}
		return this.data.filter((input) => {
			switch (true) {
				case data.includes(input.name):
					return false;
					break;
				default:
					return true;
			}
		});
	},
	data: [
		{
			name: "empty-function",
			data: function () {},
			description: "empty function"
		},
		{
			name: "invalid-svg-dimension-wrong-units-rpxr",
			data: "233rpxr",
			description: "invalid svg dimension units (rpxr)"
		},
		{
			name: "invalid-svg-dimension-wrong-units-mremm",
			data: "233mremm",
			description: "invalid svg dimension units (mremm)"
		},
		{
			name: "valid-svg-dimension-string-number",
			data: "233",
			description: "valid svg dimension string number (233)"
		},
		{
			name: "valid-svg-dimension-px",
			data: "281px",
			description: "valid svg dimension in px (281px)"
		},
		{
			name: "valid-svg-dimension-em",
			data: "5.1em",
			description: "valid svg dimension in em (5.1em)"
		},
		{
			name: "valid-svg-dimension-rem",
			data: "2.8rem",
			description: "valid svg dimension in rem (2.8rem)"
		},
		{
			name: "object-with-width-and-height",
			data: { width:300, height: 300 },
			description: "object with width and height"
		},
		{
			name: "object-with-height",
			data: { height: 300 },
			description: "valid svg height resize object"
		},
		{
			name: "valid-svg-resize-object-width",
			data: { width: 300 },
			description: "valid svg width resize object"
		},
		{
			name: "invalid-svg-resize-object",
			data: { invalid: 500, width2: 0 },
			description: "invalid svg resize object"
		},
		{
			name: "valid-svg-element",
			data: instance.toElement(),
			description: "valid svg element"
		},
		{
			name: "path-to-valid-svg",
			data: path.join(path2.svgs, "normal.svg"),
			description: "path to valid SVG",
		},
		{
			name: "valid-svg-string",
			data: fs.readFileSync(path.join(path2.svgs, "normal.svg"), "utf-8"),
			description: "valid SVG string",
		},
		{
			name: "valid-svg-in-buffer",
			data: fs.readFileSync(path.join(path2.svgs, "normal.svg")),
			description: "valid SVG in buffer",
		},
		{
			name: "buffer-with-random-string",
			data: Buffer.from("buffer with string"),
			description: "buffer with random string",
		},
		{
			name: "empty-array",
			data: new Array(),
			description: "empty array",
		},
		{
			name: "boolean-true",
			data: Boolean(true),
			description: "boolean(true)",
		},
		{
			name: "undefined",
			data: undefined,
			description: "undefined",
		},
		{
			name: "empty-object",
			data: new Object(),
			description: "empty object",
		},
		{
			name: "valid-option-update-object",
			data: { transparent: true },
			description: "valid option update object"
		},
		{
			name: "number",
			data: 123,
			description: "number",
		},
		{
			name: "random-string",
			data: "sdlfkjsdlfksdf",
			description: "random string",
		},
		{
			name: "empty-string",
			data: "",
			description: "empty-string",
		},
	],
};

module.exports = {
	path2: path2,
	inputs: inputs,
};
