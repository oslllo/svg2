"use strict";

const jimp = require("jimp");
const is = require("./validate");

const Svg2 = function (input) {
	if (arguments.length === 1 && !is.defined(input)) {
		throw new TypeError("Invalid input");
    }
    if (!(this instanceof Svg2)) {
        return new Svg2(input);
      }
	this.options = {
        resolveWithObject: false,
        pngTransparency: false,
        uriBase64Only: false,
        uriMime: jimp.MIME_PNG
	};
    this.input = this._processInput(input);
    this.output = {
        file: undefined,
        format: undefined
    }
    return this;
};

module.exports = Svg2;
