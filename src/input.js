"use strict";

const fs = require("fs");
const is = require("./validate");
const exception = require("./exception");

function _processInput (input) {
    if (!is.buffer(input) && !is.string(input)) {
        throw exception.invalidParameterError("input", "SVG string or SVG string in a buffer", input);
    }
    if (is.buffer(input)) {
        input = Buffer.from(input).toString();
    }
    if (is.pathToFile(input)) {
        input = fs.readFileSync(input, "utf-8");
    }
    if (!is.svg(input)) {
        throw new Error("Input is not a valid SVG");
    }
    return {
        string: input,
        element: this.toElement(input)
    };
}

module.exports = function (Svg2) {
    Object.assign(Svg2.prototype, {
        _processInput: _processInput
    });
}
