"use strict";

const error = require("./error");
const is = require("oslllo-validator");

function extend(options) {
    if (is.object(options)) {
        this.options.update("extend", options);
    } else if (is.number(options)) {
        var sides = new Object();
        ["top", "right", "bottom", "left"].forEach((side) => {
            sides[side] = options;
        });
        this.options.update("extend", sides);
    } else {
        throw error.invalidParameterError("options", "object or number", options);
    }
    options = this.options.get("extend");
    this.output.extend = options;
    return this;
}

module.exports = function (Svg2) {
    Object.assign(Svg2.prototype, {
        extend: extend,
    });
};
