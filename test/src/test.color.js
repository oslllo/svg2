"use strict";

const path = require("path");
const Svg2 = require("../../src");
const error = require("../../src/error");
const { path2, inputs, compare } = require("./helper");
const { assert, expect } = require("chai").use(require("chai-as-promised"));

describe("color.js", () => {
  describe("background()", () => {
    describe("- arguments", () => {
      describe("[options]", () => {
        var data = ["empty-object"];
        var source = path.join(path2.svgs.index, "normal.svg");
        inputs.valid(data).forEach((valid) => {
          it(`does not throw with valid argument ${valid.description}`, () => {
            assert.doesNotThrow(() => Svg2(source).background(valid.data), Error);
          });
        });
        inputs.invalid(data).forEach((invalid) => {
          it(`throws with invalid argument ${invalid.description}`, () => {
            assert.throws(() => Svg2(source).background(invalid.data), TypeError);
          });
        });
        var valid = [
          {
            name: "color-hex",
            data: "#96ff00",
            description: "color hex string",
          },
          {
            name: "color-hex-object",
            data: { color: "#96ff00" },
            description: "color hex object",
          },
        ];
        valid.forEach((valid) => {
          it(`does not throw with valid argument ${valid.description}`, () => {
            assert.doesNotThrow(() => Svg2(source).background(valid.data), Error);
          });
        });
      });
    });
    describe("- results", () => {
      var tasks = [
        {
          title: "can default to a white background if no color is provided",
          filename: "background-default.png",
          options: {},
        },
        {
          title: "can change the background to #96ff00 using an object",
          filename: "background-#96ff00.png",
          options: {
            color: "#96ff00",
          },
        },
        {
          title: "can change the background to #0252AB using a string",
          filename: "background-#0252AB.png",
          options: "#0252AB",
        },
      ];

      tasks.forEach((task) => {
        var name = task.filename;
        var destination = path.join(path2.generated.index, name);
        var expected = path.join(path2.expected.background.index, name);
        var instance = Svg2(path.join(path2.svgs.index, "240px.svg")).png({
          transparent: false,
        });

        it(`${task.title} | ${task.filename}`, async () => {
          instance.background(task.options);
          await instance.toFile(destination);
          var comparison = await compare(destination, expected);
          assert.isTrue(comparison, `failed to extend image ${task.filename}`);
        });
      });
    });
  });
});
