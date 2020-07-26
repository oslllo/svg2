"use strict";

const jimp = require("jimp");

module.exports = {
	AUTO: "auto",
	FORMATS: {
		bmp: jimp.MIME_BMP,
		png: jimp.MIME_PNG,
		tiff: jimp.MIME_TIFF,
		jpeg: jimp.MIME_JPEG,
	},
};
