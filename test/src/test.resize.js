"use strict";

const path = require("path");
const Svg2 = require("../../src");
const error = require("../../src/error");
const { path2, inputs, compare } = require("./helper");
const { assert, expect } = require("chai").use(require("chai-as-promised"));

describe("resize.js", () => {
    describe("extend()", () => {
        describe("- arguments", () => {
            describe("[options]", () => {
                var data = ["empty-object", "number"];
                var source = path.join(path2.svgs.index, "normal.svg");
                inputs.valid(data).forEach((valid) => {
                    it(`does not throw with valid argument ${valid.description}`, () => {
                        assert.doesNotThrow(() => Svg2(source).extend(valid.data), Error);
                    });
                });
                inputs.invalid(data).forEach((invalid) => {
                    it(`throws with invalid argument ${invalid.description}`, () => {
                        assert.throws(() => Svg2(source).extend(invalid.data), TypeError);
                    });
                });
            });
        });
        describe("- results", () => {
            var tasks = [
                {
                    title: "can extend all sides by 50px using a number",
                    filename: "extend-all-50-number.png",
                    options: 50,
                },
                {
                    title: "can extend all sides by 50px using a different color #00FF00",
                    filename: "extend-50-green.png",
                    options: {
                        top: 50,
                        right: 50,
                        bottom: 50,
                        left: 50,
                        background: "#00FF00",
                    },
                },
                {
                    title: "will not extend image if all dimensions are 0 (zero)",
                    filename: "extend-all-0.png",
                    options: {
                        background: "#FF0000",
                    },
                },
                {
                    title: "can extend all sides by 50px",
                    filename: "extend-all-50.png",
                    options: {
                        top: 50,
                        right: 50,
                        bottom: 50,
                        left: 50,
                        background: "#FF0000",
                    },
                },
                {
                    title: "can extend the bottom side only by 50px",
                    filename: "extend-bottom-50.png",
                    options: {
                        bottom: 50,
                        background: "#FF0000",
                    },
                },
                {
                    title: "can extend the bottom and left sides only by 50px",
                    filename: "extend-bottom-left-50.png",
                    options: {
                        bottom: 50,
                        left: 50,
                        background: "#FF0000",
                    },
                },
                {
                    title: "can extend the left side only by 50px",
                    filename: "extend-left-50.png",
                    options: {
                        left: 50,
                        background: "#FF0000",
                    },
                },
                {
                    title: "can extend the left and right side only by 50px",
                    filename: "extend-left-right-50.png",
                    options: {
                        left: 50,
                        right: 50,
                        background: "#FF0000",
                    },
                },
                {
                    title: "can extend the left and top side only by 50px",
                    filename: "extend-left-top-50.png",
                    options: {
                        left: 50,
                        top: 50,
                        background: "#FF0000",
                    },
                },
                {
                    title: "can extend all sides to 30x50x12x5px dimensions",
                    filename: "extend-random-30-50-12-5.png",
                    options: {
                        top: 30,
                        right: 50,
                        bottom: 12,
                        left: 5,
                        background: "#FF0000",
                    },
                },
                {
                    title: "can extend the right side by 50px",
                    filename: "extend-right-50.png",
                    options: {
                        right: 50,
                        background: "#FF0000",
                    },
                },
                {
                    title: "can extend the right and bottom side only by 50px",
                    filename: "extend-right-bottom-50.png",
                    options: {
                        right: 50,
                        bottom: 50,
                        background: "#FF0000",
                    },
                },
                {
                    title: "can extend the top side only by 50px",
                    filename: "extend-top-50.png",
                    options: {
                        top: 50,
                        background: "#FF0000",
                    },
                },
                {
                    title: "can extend the top and bottom side only by 50px",
                    filename: "extend-top-bottom-50.png",
                    options: {
                        top: 50,
                        bottom: 50,
                        background: "#FF0000",
                    },
                },
                {
                    title: "can extend the top and right side only by 50px",
                    filename: "extend-top-right-50.png",
                    options: {
                        top: 50,
                        right: 50,
                        background: "#FF0000",
                    },
                },
            ];

            tasks.forEach((task) => {
                it(`${task.title} | ${task.filename}`, async () => {
                    var instance = Svg2(path.join(path2.svgs.index, "240px.svg")).png({
                        transparent: false,
                    });
                    var name = task.filename;
                    var destination = path.join(path2.generated.index, name);
                    var expected = path.join(path2.expected.extend.index, name);
                    instance.extend(task.options);
                    await instance.toFile(destination);
                    var comparison = await compare(destination, expected);
                    assert.isTrue(comparison, `failed to extend image ${task.filename}`);
                });
            });
        });
    });
});
