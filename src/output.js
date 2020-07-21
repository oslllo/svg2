"use strict";

const fs = require("fs");
const jimp = require("jimp");
const is = require("./validate");
const { JSDOM } = require("jsdom");
const helper = require("./helper");
const exception = require("./exception");

const formats = {
    bmp: jimp.MIME_BMP,
    png: jimp.MIME_PNG,
    tiff: jimp.MIME_TIFF,
    jpeg: jimp.MIME_JPEG
}

function _process(callback) {
    this.toUri({ 
        mime: jimp.MIME_PNG, 
        base64Only: true }, (err, uri) => {
        jimp.read(Buffer.from(uri, "base64"), async (err, png) => {
            if (! this.options.pngTransparency || this.output.format !== formats.png) {
                var blankImage = await helper.blankImage(this.getDimensions());
                png = blankImage.composite(png, 0, 0);
            }
            if (this.output.format === formats.png) {
                png.getBuffer(formats.png, callback);
                return;
            } else {
                for (format in formats) {
                    if (formats[format] === this.output.format) {
                        jimp.getBuffer(format, callback);
                        return;
                    }
                }
            }
        });
    });
}

function _pipeline(callback) {
    if (is.fn(callback)) {
        this._process((err, buffer) => {
            this.output.file = buffer;
            callback(err, buffer);
        });
        return this;
    } else {
        return new Promise((resolve, reject) => {
            this._process((err, buffer) => {
                this.output.file = buffer;
                err ? reject(err) : resolve(buffer);
            });
        });
    }
}

function uri(options) {
    this.output.format = formats.uri;
    return this;
}

function png(options) {
    this.output.format = formats.png;
    return this;
}

function jpeg() {
    this.output.format = formats.jpeg;
    return this;
}

function tiff() {
    this.output.format = formats.tiff;
    return this;
}

function bmp() {
    this.output.format = formats.bmp;
    return this;
}

function getDimensions () {
    var svg = this.input.element;
    var dimension = {
        names: ["width", "height"],
        data: { width: 0, height: 0 },
    };
    var dn = dimension.names;
    var dd = dimension.data;
    if (svg.hasAttribute(dn[0]) && svg.hasAttribute(dn[1])) {
        var height = svg.getAttribute(dn[0]);
        var width = svg.getAttribute(dn[1]);
        for (var i = 0; i < dn.length; i++) {
            var name = dn[i];
            switch (name) {
                case "width":
                    dd.width = helper.toPx(width);
                    break;
                case "height":
                    dd.height = helper.toPx(height);
                    break;
            }
        }
    } else if (svg.hasAttribute("viewBox")) {
        var viewbox = svg.getAttribute("viewBox").split(" ");
        dd.width = Number(viewbox[2]);
        dd.height = Number(viewbox[3]);
    } else {
        throw Error(
            `Failed to get SVG dimensions, height/width and viewBox attributes are not set on SVG.`
        );
    }
    return dd;
}

// { mime: jimp.MIME_PNG, base64only: false };
function toUri(options, callback) {
    if (is.object(options)) {
        if (is.defined(options.mime)) {
            this.options.uriMime = options.mime;
        }
        if (is.defined(options.base64Only)) {
            this.options.uriBase64Only = options.base64Only
        }
    }
    var mime = this.options.uriMime;
    var base64only = this.options.uriBase64Only
    var svg = this.input.string;
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
    function draw() {
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        ctx.drawImage(image, 0, 0);
        var uri = canvas.toDataURL(mime);
        if (base64only) {
            uri = uri.replace(new RegExp(`^data:${mime};base64,`), "");
        }
        return uri;
    }
    if (is.defined(callback)) {
        if (!is.fn(callback)) {
            throw exception.invalidParameterError("callback", "function", callback);
        }
        image.onload = () => {
            var uri = draw();
            callback(null, uri);
        };
    } else {
        return new Promise((resolve, reject) => {
            image.onload = () => {
                var uri = draw();
                resolve(uri);
            };
        });
    }
}

function toBuffer(callback) {
    return this._pipeline(callback);
}

function toFile(outputPath, callback) {
    if (! outputPath || outputPath.length === 0) {
        const err = new TypeError('Output file path is missing');
        if (is.fn(callback)) {
            callback(err);
        } else {
            return Promise.reject(err);
        }
    } else {
        if (is.fn(callback)) {
            this._pipeline((err, buffer) => {
                fs.writeFile(outputPath, buffer, callback);
            });
        } else {
            return new Promise((resolve, reject) => {
                this._pipeline((err, buffer) => {
                    if (err) {
                        throw err;
                    }
                    fs.writeFile(outputPath, buffer, (err) => {
                        err ? reject(err) : resolve();
                    });
                });
            });
        }
    }
}

function toElement (input) {
    input = input ? input : this.input.string;
    return new JSDOM(input, {
        resources: "usable",
    }).window.document.getElementsByTagName("svg")[0];
}

module.exports = function (Svg2) {
    Object.assign(Svg2.prototype, {
        uri: uri,
        png: png,
        bmp: bmp,
        jpeg: jpeg,
        tiff: tiff,
        toUri: toUri,
        toFile: toFile,
        toBuffer: toBuffer,
        toElement: toElement,
        getDimensions: getDimensions,
        // private
        _process: _process,
        _pipeline: _pipeline
    });
}
