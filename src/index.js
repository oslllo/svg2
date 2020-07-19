"use strict";

const fs = require("fs");
const path = require("path");
const jimp = require("jimp");
const core = require("./core");
const { JSDOM } = require("jsdom");
const validate = require("./validate");

var Svg2 = function (input) {
	var inputIsBuffer = validate.isBuffer(input);
	if ((typeof input != "string") && !inputIsBuffer) {
		throw TypeError(
			`input should be an SVG string or buffer, ${typeof input} given.`
		);
    }
	if (inputIsBuffer) {
		input = Buffer.from(input).toString();
    } else if (validate.isFilePath(input)) {
        input = fs.readFileSync(input, "utf-8");
    }
	if (!validate.isSvg(input)) {
		throw TypeError(`input is not a valid SVG.`);
	}
    this.input = input;
    this.output = null;
	this.svg = this.element();
};

Svg2.jimp = jimp;

Svg2.prototype = {
    resize: async function (dimensions) {
        if (! dimensions || (dimensions.constructor.name !== "Object")) {
            throw TypeError(`dimensions parameter should be an object, ${typeof dimensions} given.`);
        }
        var blank = await core.blank();
        var names = ["width", "height"];
        for (var i = 0; i < names.length; i++) {
            var name = names[i];
            var dimension = dimensions[name];
            if (dimension == undefined) {
                dimensions[name] = jimp.AUTO;
            }
        }
        blank.resize(dimensions.width, dimensions.height);
        this.svg.setAttribute("width", blank.bitmap.width);
        this.svg.setAttribute("height", blank.bitmap.height);
        return
    },
	getDimensions: function () {
		var dimension = {
			names: ["width", "height"],
			data: { width: 0, height: 0 },
		};
		var dn = dimension.names;
		var dd = dimension.data;
		if (this.svg.hasAttribute(dn[0]) && this.svg.hasAttribute(dn[1])) {
			var height = this.svg.getAttribute(dn[0]);
			var width = this.svg.getAttribute(dn[1]);
			for (var i = 0; i < dn.length; i++) {
				var name = dn[i];
				switch (name) {
					case "width":
						dd.width = core.convertToPx(width);
						break;
					case "height":
						dd.height = core.convertToPx(height);
						break;
				}
			}
		} else if (this.svg.hasAttribute("viewBox")) {
			var viewbox = this.svg.getAttribute("viewBox").split(" ");
			dd.width = Number(viewbox[2]);
			dd.height = Number(viewbox[3]);
		} else {
			throw Error(
				`Failed to get SVG dimensions, height/width and viewBox attributes are not set on SVG.`
			);
		}
		return dd;
	},
	element: function (input) {
        input = input ? input : this.input;
        return new JSDOM(this.input, {
            resources: "usable",
        }).window.document.getElementsByTagName("svg")[0];
	},
	uri: async function (options) {
        var preset = { mime: jimp.MIME_PNG, base64only: false };
        options = core.setOptions(preset, options);
        var svg = this.svg.outerHTML;
        var dimensions = this.getDimensions();
        var window = new JSDOM(svg, { resources: "usable" }).window;
        var document = window.document;
        var canvas = document.createElement("canvas");
        var image = new window.Image();
        var ctx = canvas.getContext("2d");
        image.style = "position: absolute; top: -9999px";
        document.body.appendChild(image);
        const encoded = encodeURIComponent(svg)
            .replace(/'/g, "%27")
            .replace(/"/g, "%22");
        const header = "data:image/svg+xml,";
        const encodedHeader = header + encoded;
        image.src = encodedHeader;
        function loading () {
            return new Promise((resolve, reject) => {
                image.onload = () => resolve();
            });
        }
        await loading();
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        ctx.drawImage(image, 0, 0);
        var uri = canvas.toDataURL(options.mime);
        if (options.base64only) {
            uri = uri.replace(new RegExp(`^data:${options.mime};base64,`), "");
        }
        return uri;
	},
	png: async function (options) {
        var preset = { transparent: false };
        options = core.setOptions(preset, options);
        var uri = await this.uri({ mime: jimp.MIME_PNG, base64only: true });
        var png = await jimp.read(Buffer.from(uri, "base64"));
       if (!options.transparent) {
           var blank = await core.blank(this.getDimensions());
           var png = blank.composite(png, 0, 0);
       }
       this.output = png;
       return this.output
    },
    jpeg: async function () {
        var png = await this.png();
        var jpeg = await png.getBufferAsync(jimp.MIME_JPEG);
        this.output = await jimp.read(jpeg);
        return this.output;
    },
    tiff: async function () {
        var png = await this.png();
        var tiff = await png.getBufferAsync(jimp.MIME_TIFF);
        this.output = await jimp.read(tiff);
        return this.output;
    },
    bmp: async function () {
        var png = await this.png();
        var bmp = await png.getBufferAsync(jimp.MIME_BMP);
        this.output = await jimp.read(bmp);
        return this.output;
    },
    string: async function () {
        var string = this.svg.outerHTML;
        this.output = string;
        return string;
    },
	toFile: function (destination) {
        return new Promise(async (resolve, reject) => {
            try {
                if(!destination || (typeof destination !== "string")) {
                    throw TypeError(`destination should be a string, ${typeof destination} given.`);
                }
                if (this.output instanceof jimp) {
                    await this.output.write(destination);
                } else {
                    fs.writeFileSync(destination, this.output);
                }
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    },
    toBuffer: function () {
        return new Promise(async (resolve, reject) => {
            try {
                var buffer
                if (this.output instanceof jimp) {
                    buffer = await this.output.getBufferAsync(this.output._originalMime);
                } else if (! validate.isBuffer(this.output)) {
                    buffer = Buffer.from(this.output);
                }
                this.output = buffer;
                resolve(buffer);
            } catch (err) {
                reject(err);
            }
        });
    },
};

module.exports = Svg2;
