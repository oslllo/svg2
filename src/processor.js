"use strict";

const jimp = require("jimp");
const is = require("oslllo-validator");
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
    i.svg
      .png(i.svg.html())
      .then(async (png) => {
        png = await jimp.read(png);
        /**
         * @ignore
         * @description - Because only pngs can be transparent
         * */
        if (!i.options.get("png").transparent || i.output.format !== formats.png) {
          var dimensions = i.svg.dimensions();
          png = await this.background(png, dimensions);
        }
        for (var format in formats) {
          if (formats[format] === i.output.format) {
            png.getBuffer(formats[format], callback);
            break;
          }
        }
      })
      .catch((error) => {
        callback(error);
      });
  },
  blank: function (width = jimp.AUTO, height = jimp.AUTO, background) {
    if (!background) {
      background = this.instance.options.get("background").color;
    }
    return new jimp(width, height, background);
  },
  background: async function (image, dimensions) {
    var { width, height } = dimensions;

    var x, y;
    x = y = 0;

    /**
     * @ignore
     * @description - Set initial background
     */
    var background = await this.blank(width, height);
    image = background.composite(image, x, y);

    if (this.instance.output.extend) {
      var options = this.instance.options.get("extend");

      var extended = {
        background: options.background,
        height: options.top + options.bottom + height,
        width: options.left + options.right + width,
      };

      if (options.left) {
        x = x + options.left;
      }

      if (options.top) {
        y = y + options.top;
      }

      extended.image = await this.blank(extended.width, extended.height, extended.background);

      image = extended.image.composite(image, x, y);
    }

    return image;
  },
};

module.exports = Processor;
