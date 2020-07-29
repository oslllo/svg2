"use strict";

const jimp = require("jimp");
const is = require("./validate");
const constants = require("./constants");

const formats = constants.FORMATS;

function Processor(instance) {
	this.instance = instance;
}

Processor.prototype = {
	pipeline: function (callback) {
		var format = this.instance.output.format;
		if (!format || !is.defined(format)) {
			const err = new Error(`Output format was not set.`);
			callback(err);
			return;
		}
		var i = this.instance;
		if (is.fn(callback)) {
			this.process((err, buffer) => {
				i.output.file = buffer;
				callback(err, buffer);
			});
		} else {
			return new Promise((resolve, reject) => {
				this.process((err, buffer) => {
					i.output.file = buffer;
					err ? reject(err) : resolve(buffer);
				});
			});
		}
	},
	process: function (callback) {
		var i = this.instance;
		i.toUri({ mime: formats.png, base64: true }).then(async (uri) => {
			try {
				var png = await jimp.read(Buffer.from(uri, "base64"));
				if (!i.options.get("png").transparent || i.output.format !== formats.png) {
					var dimensions = i.svg.dimensions();
					var blank = await i.blank(dimensions.width, dimensions.height);
					png = blank.composite(png, 0, 0);
				}
				for (var format in formats) {
					if (formats[format] === i.output.format) {
						png.getBuffer(formats[format], callback);
						break;
					}
				}
			} catch (err) {
				callback(err);
			}
		});
	},
};

module.exports = Processor;
