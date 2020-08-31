"use strict";

const error = require("./error");
const is = require("oslllo-validator");

function background(options) {
    if (is.object(options)) {
        this.options.update("background", options);
    } else if (is.hexColor(options)) {
        this.options.update("background", { color: options });
    } else {
        throw error.invalidParameterError(
            "options",
            "object or hex color string",
            options
        );
    }
    options = this.options.get("background");
    if (
        !is.hexColor(options.color) ||
        (is.number(Number(options.color)) && !is.actualNaN(Number(options.color)))
    ) {
        throw error.invalidParameterError(
            "background.color",
            "hex color string",
            options
        );
    }
    this.output.background = options;
    return this;
}

module.exports = function (Svg2) {
    Object.assign(Svg2.prototype, {
        background: background,
    });
};
