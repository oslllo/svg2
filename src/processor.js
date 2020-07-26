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
		// Throw if format is not selected
		var i = this.instance;
		switch (true) {
			case is.fn(callback):
				this.process((err, buffer) => {
					i.output.file = buffer;
					callback(err, buffer);
				});
				return i;
				break;
			default:
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
					var getBlankImage = await i.blank(i.svg.dimensions());
					png = getBlankImage.composite(png, 0, 0);
				}
				if (i.output.format === formats.png) {
					png.getBuffer(formats.png, callback);
					return;
				} else {
					for (var format in formats) {
						if (formats[format] === i.output.format) {
							png.getBuffer(formats[format], callback);
							break;
						}
					}
				}
			} catch (err) {
				throw err;
			}
		});
	},
};

module.exports = Processor;
