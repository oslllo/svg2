"use strict";

const Svg2 = require("..");
const error = require("./error");
const is = require("oslllo-validator");
const constants = require("./constants");
const { renderAsync } = require("@resvg/resvg-js");
const Svg = function (instance) {
  this.instance = instance;
  this.update(instance.toElement(instance.input.string), true);
};

Svg.prototype = {
  update: function (svg, isElement = false) {
    if (isElement) {
      if (svg.constructor.name !== "SVGSVGElement") {
        throw error.invalidParameterError("svg", "SVGSVGElement", svg);
      }
    } else {
      svg = this.instance.check(svg);
      svg = this.instance.toElement(svg);
    }
    this.instance.input.element = svg;
    this.instance.input.string = svg.outerHTML;
    return this.instance;
  },
  resize: function (input) {
    if (!is.defined(input) || (input.constructor.name !== "Object" && !is.number(input))) {
      throw error.invalidParameterError("input", "object or number", input);
    }
    var svg = this.element();
    var current = this.dimensions();
    var output = {
      scale: 0,
      width: undefined,
      height: undefined,
    };
    function set(dimension) {
      var opposite = dimension == "height" ? "width" : "height";
      output[dimension] = input[dimension];
      if (input[opposite] === constants.AUTO) {
        output[opposite] = output[opposite] = (input[dimension] / current[dimension]) * current[opposite];
      } else {
        output[opposite] = current[opposite];
      }
      return output;
    }
    if (is.number(input)) {
      output.width = current.width * input;
      output.height = current.height * input;
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
      } else if (is.defined(input.width) && input.width !== constants.AUTO) {
        output = set("width");
      } else if (is.defined(input.height) && input.height !== constants.AUTO) {
        output = set("height");
      } else {
        throw error.invalidParameterError("input", "width or height in object", input);
      }
      output.scale = (output.width / current.width + output.height / current.height) / 2;
    }
    svg.setAttribute("width", output.width);
    svg.setAttribute("height", output.height);
    this.update(svg, true);
    this.instance.output.resize = output;
    return this.instance;
  },
  html: function () {
    return this.instance.input.string;
  },
  png: async function (svg) {
    const opts = {
      font: {
        loadSystemFonts: false, // It will be faster to disable loading system fonts.
      },
    };
    const resvg = await renderAsync(svg, opts);
    const pngBuffer = resvg.asPng();

    return pngBuffer;
  },
  element: function () {
    return this.instance.input.element;
  },
  dimensionToPx: function (input) {
    if (!input || (typeof input != "string" && typeof input != "number")) {
      throw error.invalidParameterError("input", "string with dimension or number", input);
    }

    function round(input) {
      return Math.round((input + Number.EPSILON) * 100) / 100;
    }

    var units = ["rem", "px", "em", "ex", "ch", "cm", "mm", "q", "in", "pc", "pt"];
    var convert = false;
    for (var i = 0; i < units.length; i++) {
      var unit = units[i];
      convert = typeof input == "string" && input.search(unit) !== -1;
      if (convert) {
        input = input.replace(unit, "");
        const cm = 96 / 2.54;
        const inch = 2.54 * cm;
        switch (unit.toLowerCase()) {
          case "px":
            break;
          case "em":
          case "rem":
            input = input * 16; // we can get away with this because we use jsdom.
            break;
          case "ex":
            input = round(input * 7.156);
            break;
          case "ch":
            input = input * 8;
            break;
          case "cm":
            input = input * cm;
            break;
          case "mm":
            input = round(input * ((1 / 10) * cm));
            break;
          case "q":
            input = input * ((1 / 40) * cm);
            break;
          case "in":
            input = input * inch;
            break;
          case "pc":
            input = input * ((1 / 6) * inch);
            break;
          case "pt":
            input = input * ((1 / 72) * inch);
            break;
        }
      }
    }
    var dimension = Number(input);
    if (isNaN(dimension)) {
      throw error.invalidParameterError("input", "a valid dimension i.e 20px, 20rem, 20em or 20", input);
    }
    return dimension;
  },
  viewBox: function (svg) {
    if (!svg.hasAttribute("viewBox")) {
      throw error.invalidParameterError(
        "SVG dimension",
        "height/width and viewBox attributes to be set",
        this.instance.svg.html()
      );
    }
    var viewBox = svg.getAttribute("viewBox").split(" ");
    return {
      "min-x": Number(viewBox[0]),
      "min-y": Number(viewBox[1]),
      width: Number(viewBox[2]),
      height: Number(viewBox[3]),
    };
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
      if (!width.includes("%") && !width.includes("vw") && !height.includes("%") && !height.includes("vh")) {
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
      } else {
        var viewbox = this.viewBox(svg);
        dd.width = viewbox.width;
        dd.height = viewbox.height;
      }
    } else {
      var viewbox = this.viewBox(svg);
      dd.width = viewbox.width;
      dd.height = viewbox.height;
    }
    return dd;
  },
};

module.exports = Svg;
