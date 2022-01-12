"use strict";

const fs = require("fs");
const jimp = require("jimp");
const error = require("./error");
const domino = require("domino");
const is = require("oslllo-validator");
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

function _getDocument(input) {
  const document = domino.createDocument(input, true);
  return document;
}

function toElement(input) {
  input = input ? input : this.svg.html();
  input = this.check(input);
  return _getDocument(input).getElementsByTagName("svg")[0];
}

function toUri(options = {}, callback) {
  if (arguments.length === 1 && is.fn(options)) {
    callback = options;
  } else {
    this.options.update("uri", options);
  }
  options = this.options.get("uri");
  var mime = options.mime;
  var base64 = options.base64;
  var svg = this.svg.html();
  var png = this.svg.png(svg);

  async function generateDataUri() {
    const buffer = await png;
    var image = await jimp.read(buffer);
    var uri = await image.getBase64Async(mime);
    if (base64) {
      uri = uri.replace(new RegExp(`^data:${mime};base64,`), "");
    }
    return uri;
  }
  if (is.defined(callback)) {
    if (!is.fn(callback)) {
      throw error.invalidParameterError("callback", "function", callback);
    }

    generateDataUri()
      .then((uri) => {
        callback(null, uri);
      })
      .catch((error) => {
        callback(error);
      });
  } else {
    return generateDataUri();
  }
}

function toBuffer(callback) {
  if (is.defined(callback) && !is.fn(callback) && callback !== undefined) {
    throw error.invalidParameterError("callback", "function", callback);
  }
  return this.processor.pipeline(callback);
}

function toFile(destination, callback) {
  if (!destination || destination.length === 0 || typeof destination !== "string") {
    const err = error.invalidParameterError("destination", "string", destination);
    if (is.fn(callback)) {
      callback(err);
    } else {
      return Promise.reject(err);
    }
  } else {
    if (callback || is.defined(callback)) {
      if (is.fn(callback)) {
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
};
