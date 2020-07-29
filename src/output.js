"use strict";

const fs = require("fs");
const jimp = require("jimp");
const is = require("./validate");
const error = require("./error");
const { JSDOM } = require("jsdom");
const constants = require("./constants");

const formats = constants.FORMATS;

function png(options = {}) {
    this.options.update("png", options);
    options = this.options.get("png");
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

function toElement (input) {
    input = input ? input : this.svg.html();
    input = this.check(input);
    return new JSDOM(input, {
        resources: "usable",
    }).window.document.getElementsByTagName("svg")[0];
}

function toUri(options = {}, callback) {
    if (arguments.length === 1 && is.fn(options)) {
        callback = options;
    } else {
        this.options.update("uri", options);
    }
    options = this.options.get("uri");
    var mime = options.mime;
    var base64 = options.base64
    var svg = this.svg.html();
    var dimensions = this.svg.dimensions();
    var window = new JSDOM(svg, { resources: "usable" }).window;
    var document = window.document;
    var canvas = document.createElement("canvas");
    var image = new window.Image();
    var ctx = canvas.getContext("2d");
    image.style = "position: absolute; top: -9999px; bottom: -9999px;";
    document.body.appendChild(image);
    const encoded = encodeURIComponent(svg)
        .replace(/'/g, "%27")
        .replace(/"/g, "%22");
    const header = "data:image/svg+xml,";
    const encodedHeader = header + encoded;
    image.src = encodedHeader;
    function generateDataUri() {
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        ctx.drawImage(image, 0, 0);
        var uri = canvas.toDataURL(mime);
        if (base64) {
            uri = uri.replace(new RegExp(`^data:${mime};base64,`), "");
        }
        return uri;
    }
    if (is.defined(callback)) {
        if (!is.fn(callback)) {
            throw error.invalidParameterError("callback", "function", callback);
        }
        image.onload = () => {
            var uri = generateDataUri();
            callback(null, uri);
        };
    } else {
        return new Promise((resolve, reject) => {
            image.onload = () => {
                var uri = generateDataUri();
                resolve(uri);
            };
        });
    }
}

function toBuffer(callback) {
    if (is.defined(callback) && !is.fn(callback) && callback !== undefined) {
        throw error.invalidParameterError("callback", "function", callback);
    }
    return this.processor.pipeline(callback);
}

function toFile(destination, callback) {
    if (! destination || destination.length === 0 || typeof destination !== "string") {
        const err = error.invalidParameterError("destination", "string", destination);
        if (is.fn(callback)) {
            callback(err);
        } else {
            return Promise.reject(err);
        }
    } else {
        if (callback || is.defined(callback)) {
            if(is.fn(callback)) {
                this.processor.pipeline((err, buffer) => {
                    fs.writeFile(destination, buffer, callback);
                });
            } else {
                throw error.invalidParameterError("callback", "function", callback);
            }
        } else {
            return new Promise((resolve, reject) => {
                var error;
                this.processor.pipeline((err, buffer) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    fs.writeFile(destination, buffer, (err) => {
                        err ? reject(err) : resolve();
                    });
                });
            });
        }
    }
}

module.exports = function (Svg2) {
    Object.assign(Svg2.prototype, {
        png: png,
        bmp: bmp,
        jpeg: jpeg,
        tiff: tiff,
        toUri: toUri,
        toFile: toFile,
        toBuffer: toBuffer,
        toElement: toElement,
    });
}
