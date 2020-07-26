"use strict";

const Svg2 = require("..");
const is = require("./validate");
const error = require("./error");
const constants = require("./constants");

const Svg = function (instance) {
	this.instance = instance;
	this.update(instance.toElement(instance.input.string));
};

Svg.prototype = {
	update: function (svg) {
		if (svg.constructor.name !== "SVGSVGElement") {
			throw error.invalidParameterError("svg", "SVGSVGElement", svg);
		}
		this.instance.input.element = svg;
		this.instance.input.string = svg.outerHTML;
		return this.instance;
	},
	resize: function (input) {
		if (
			!is.defined(input) ||
			(input.constructor.name !== "Object" && !is.number(input))
		) {
			throw error.invalidParameterError("input", "object or number", input);
		}
		var svg = this.element();
		var dimensions = this.dimensions();
		var output = {
			scale: 0,
			width: undefined,
			height: undefined,
		};
		function set(dimension) {
			var opposite = dimension == "height" ? "width" : "height";
			output[dimension] = input[dimension];
			//! scaling might be broken here
			output.scale = input.height / dimensions[dimension];
			if (input[opposite] === constants.AUTO) {
				output[opposite] =
					input[dimension] - dimensions[dimension] + dimensions[opposite];
			} else {
				output[opposite] = dimensions[opposite];
			}
		}
		if (is.number(input)) {
			output.width = dimensions.width * input;
			output.height = dimensions.height * input;
			output.scale = input;
		} else {
			if (
				is.defined(input.width) &&
				input.width !== constants.AUTO &&
				is.defined(input.height) &&
				input.height !== constants.AUTO
			) {
				output.width = input.width;
				output.height = input.height;
				output.scale =
					(input.width / dimensions.width + input.height / dimensions.height) /
					2;
			} else if (is.defined(input.width) && input.width !== constants.AUTO) {
				set("width");
			} else if (is.defined(input.height) && input.height !== constants.AUTO) {
				set("height");
			} else {
				throw error.invalidParameterError(
					"input",
					"width or height in object",
					input
				);
			}
		}
		svg.setAttribute("width", output.width);
		svg.setAttribute("height", output.height);
		this.update(svg);
		this.instance.output.resize = output;
		return this.instance;
	},
	html: function () {
		return this.instance.input.string;
	},
	element: function () {
		return this.instance.input.element;
	},
	dimensionToPx: function (input) {
		if (!input || (typeof input != "string" && typeof input != "number")) {
			throw error.invalidParameterError(
				"input",
				"string with dimension or number",
				input
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
		var dimension = Number(input);
		if (isNaN(dimension)) {
			throw error.invalidParameterError(
				"input",
				"a valid dimension i.e 20px, 20rem, 20em or 20",
				input
			);
		}
		return dimension;
	},
	dimensions: function () {
		var svg = this.element();
		var dimension = {
			names: ["width", "height"],
			data: { width: 0, height: 0 },
		};
		var dn = dimension.names;
		var dd = dimension.data;
		if (svg.hasAttribute(dn[0]) && svg.hasAttribute(dn[1])) {
			var width = svg.getAttribute(dn[0]);
			var height = svg.getAttribute(dn[1]);
			for (var i = 0; i < dn.length; i++) {
				var name = dn[i];
				switch (name) {
					case "width":
						dd.width = this.dimensionToPx(width);
						break;
					case "height":
						dd.height = this.dimensionToPx(height);
						break;
				}
			}
		} else if (svg.hasAttribute("viewBox")) {
			var viewbox = svg.getAttribute("viewBox").split(" ");
			dd.width = Number(viewbox[2]);
			dd.height = Number(viewbox[3]);
		} else {
			throw error.invalidParameterError(
				"SVG dimension",
				"height/width and viewBox attributes to be set",
				this.instance.svg.html()
			);
		}
		return dd;
	},
};

module.exports = Svg;
