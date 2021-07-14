"use strict";

const fs = require("fs");
const path = require("path");
const jimp = require("jimp");
const Svg2 = require("../../src");
const looksame = require("looks-same");
const is = require("oslllo-validator");
const error = require("../../src/error");
const Option = require("../../src/option");
const { path2, inputs } = require("./helper");
const { assert, expect } = require("chai").use(require("chai-as-promised"));

describe("svg.js", () => {
	describe("new Svg()", () => {
		describe("svg.update()", () => {
			describe("- arguments", () => {
				describe("[input]", () => {
					var data = ["valid-svg-element"];
					var instance = Svg2(path.join(path2.svgs.index, "normal.svg"));
					var svg = instance.svg;
					// throws with invalid svg parameter
					inputs.invalid(data).forEach((input) => {
						it(`throws with invalid svg parameter (element) (${input.description})`, () => {
							assert.throws(() => svg.update(input.data, true), TypeError);
						});
					});
					// does not throw with valid svg parameter
					inputs.valid(data).forEach((input) => {
						it(`does not throw with valid (element) (${input.description})`, () => {
							assert.doesNotThrow(() => svg.update(input.data, true), Error);
						});
					});
				});
			});
			describe("- results", () => {
				it("can update instance SVG using (SVG Element)", () => {
					var instance = Svg2(path.join(path2.svgs.index, "normal.svg"));
					var svg = instance.svg;
					var current = svg.html();
					var update = fs.readFileSync(
						path.join(path2.svgs.index, "normal-2.svg"),
						"utf-8"
					);
					assert.isTrue(is.svg(current), `current SVG is not a valid svg, ${current}`);
					assert.isTrue(is.svg(update), `update SVG is not a valid svg, ${update}`);
					assert.notEqual(
						current, update,
						"current and new SVG strings are identical"
					);
					svg.update(instance.toElement(update), true);
					assert.equal(update, svg.html(), "SVG failed to update");
				});
				it("can update instance SVG using (SVG String)", () => {
					var instance = Svg2(path.join(path2.svgs.index, "normal.svg"));
					var svg = instance.svg;
					var current = svg.html();
					var update = fs.readFileSync(
						path.join(path2.svgs.index, "normal-2.svg"),
						"utf-8"
					);
					assert.isTrue(is.svg(current), `current SVG is not a valid svg, ${current}`);
					assert.isTrue(is.svg(update), `update SVG is not a valid svg, ${update}`);
					assert.notEqual(
						current, update,
						"current and new SVG strings are identical"
					);
					svg.update(update);
					assert.equal(update, svg.html(), "SVG failed to update");
				});
				it("can update instance SVG using (path)", () => {
					var instance = Svg2(path.join(path2.svgs.index, "normal.svg"));
					var svg = instance.svg;
					var current = svg.html();
					var source = path.join(path2.svgs.index, "normal-2.svg");
					var update = fs.readFileSync(source, "utf-8");
					assert.isTrue(is.svg(current), `current SVG is not a valid svg, ${current}`);
					assert.isTrue(is.svg(update), `update SVG is not a valid svg, ${update}`);
					assert.notEqual(
						current, update,
						"current and new SVG strings are identical"
					);
					svg.update(update);
					assert.equal(update, svg.html(), "SVG failed to update");
				});
			});
		});
		describe("svg.resize()", () => {
			describe("- arguments", () => {
				describe("[input]", () => {
					var data = [
						"number",
						"object-with-width-and-height",
						"object-with-height",
						"valid-svg-resize-object-width",
					];
					var instance = Svg2(path.join(path2.svgs.index, "normal.svg"));
					var svg = instance.svg;
					// throws with invalid input parameter
					inputs.invalid(data).forEach((input) => {
						it(`throws with invalid input parameter (${input.description})`, () => {
							assert.throws(() => svg.resize(input.data), TypeError);
						});
					});
					// does not throw with valid input parameter
					inputs.valid(data).forEach((input) => {
						it(`does not throw with valid input paramater (${input.description})`, () => {
							assert.doesNotThrow(() => svg.resize(input.data), Error);
						});
					});
				});
			});
			describe("- results", () => {
				it("can set SVG width and height", async () => {
					var instance = Svg2(path.join(path2.svgs.index, "normal-2.svg"));
					var svg = instance.svg;
					var dimensions = { width: 240, height: 240 };
					assert.notDeepEqual(
						svg.dimensions(),
						dimensions,
						"current and new dimensions do not match before change"
					);
					svg.resize(dimensions);
					assert.deepEqual(
						svg.dimensions(),
						dimensions,
						"dimensions match after change"
					);
				});
				it("can set SVG height without changing width", () => {
					var instance = Svg2(path.join(path2.svgs.index, "normal-2.svg"));
					var svg = instance.svg;
					var dimensions = { height: 142 };
					var expected = { height: 142, width: svg.dimensions().width };
					assert.notDeepEqual(
						svg.dimensions(),
						expected,
						"current and new dimensions do not match before change"
					);
					svg.resize(dimensions);
					assert.deepEqual(
						svg.dimensions(),
						expected,
						"dimensions match after change"
					);
				});
        it("can set SVG height with AUTO width when dimensions are uneven", async () => {
					var instance = Svg2(path.join(path2.svgs.index, "uneven-dimensions.svg"));
					var svg = instance.svg;
					var dimensions = { height: 24, width: Svg2.AUTO };
					var expected = { height: 24, width: 48 };
					assert.notDeepEqual(
						svg.dimensions(),
						expected,
						"current and new dimensions do not match before change"
					);
					svg.resize(dimensions);
					assert.deepEqual(
						svg.dimensions(),
						expected,
						"dimensions match after change"
					);
				});
				it("can set SVG height with AUTO width", async () => {
					var instance = Svg2(path.join(path2.svgs.index, "normal-2.svg"));
					var svg = instance.svg;
					var dimensions = { height: 400, width: Svg2.AUTO };
					var expected = { height: 400, width: 400 };
					assert.notDeepEqual(
						svg.dimensions(),
						expected,
						"current and new dimensions do not match before change"
					);
					svg.resize(dimensions);
					assert.deepEqual(
						svg.dimensions(),
						expected,
						"dimensions match after change"
					);
				});
				it("can export a 500x500.png resized SVG", async () => {
					var instance = Svg2(path.join(path2.svgs.index, "normal-2.svg"));
					var svg = instance.svg;
					var dimensions = { width: 500, height: 500 };
					var name = "500x500-resized.png";
					var destination = path.resolve(path.join(path2.generated.index, name));
					await svg.resize(dimensions).png().toFile(destination);
					var resized = await jimp.read(destination);
					var rb = resized.bitmap;
					assert.deepEqual({ width: rb.width, height: rb.height }, dimensions);
				});
				it(`exports a 500x500.png resized SVG that looks correct`, (done) => {
					var name = "500x500-resized.png";
					looksame(
						path.join(path2.generated.index, name),
						path.join(path2.expected.svg.resize.index, name),
						{ strict: true },
						(error, data) => {
							assert.isTrue(data.equal);
							error ? done(error) : done();
						}
					);
				});
			});
		});
		describe("svg.dimensions()", () => {
			describe("- results", () => {
				it("throws when SVG does not have width and height attributes or a viewBox", () => {
					var instance = Svg2(
						path.join(path2.svgs.index, "without-viewbox-or-dimension-attributes.svg")
					);
					var svg = instance.svg;
					assert.throws(() => svg.dimensions(), TypeError);
				});
				// it can get dimensions
				var svgs = [
					{
						name: "normal.svg",
						dimensions: { width: 48, height: 48 },
					},
					{
						name: "normal-2.svg",
						dimensions: { width: 24, height: 24 },
					},
					{
						name: "with-uneven-px-dimensions.svg",
						dimensions: { width: 19, height: 13.444 },
					},
					{
						name: "with-em-dimensions.svg",
						dimensions: { width: 72, height: 72 },
					},
					{
						name: "with-px-dimensions.svg",
						dimensions: { width: 96, height: 96 },
					},
          {
            name: "with-vh-vw-dimensions.svg",
            dimensions: { width: 24, height: 24 },
          },
					{
						name: "with-viewbox-only.svg",
						dimensions: { width: 24, height: 24 },
					},
					{
						name: "with-rem-dimensions.svg",
						dimensions: { width: 120, height: 120 },
                    },
                    {
						name: "with-%-dimensions.svg",
						dimensions: { width: 24, height: 24 },
                    },
                    {
						name: "with-%-and-px-dimensions.svg",
						dimensions: { width: 24, height: 24 },
					},
				];

        ['ch', 'cm', 'ex', 'in', 'mm', 'pc', 'pt', 'q'].forEach(function(d) {
          svgs.push({
            name: `with-${d}-dimensions.svg`,
            dimensions: { width: 24, height: 24 }
          });
        });

				svgs.forEach((svg) => {
					var name = svg.name;
					it(`can get dimensions for ${name}`, () => {
						var instance = Svg2(path.join(path2.svgs.index, name));
						assert.deepEqual(instance.svg.dimensions(), svg.dimensions);
					});
				});
				it(`can adjust width without changing height`, () => {
					var instance = Svg2(path.join(path2.svgs.index, "normal-2.svg"));
					var svg = instance.svg;
					var current = { width: 24, height: 24 }; // 576 2304
					assert.deepEqual(
						svg.dimensions(),
						current,
						"svg dimensions and expected do not match"
					);
					svg.resize({ width: 100 });
					assert.deepEqual(
						svg.dimensions(),
						{ width: 100, height: 24 }, // 2400
						"svg dimensions did not update correctly"
					);
					var scale = instance.output.resize.scale;
					assert.equal(
						scale,
						2.5833333333333335,
						"svg did not scale correctly"
					);
				});
				it(`can adjust height without changing width`, () => {
					var instance = Svg2(path.join(path2.svgs.index, "normal-2.svg"));
					var svg = instance.svg;
					var current = { width: 24, height: 24 };
					assert.deepEqual(
						svg.dimensions(),
						current,
						"svg dimensions and expected do not match"
					);
					svg.resize({ height: 48 });
					assert.deepEqual(
						svg.dimensions(),
						{ width: 24, height: 48 },
						"svg dimensions did not update correctly"
					);
					var scale = instance.output.resize.scale;
					assert.equal(scale, 1.5, "svg did not scale correctly");
				});
				it(`can adjust width with AUTO height (even)`, () => {
					var instance = Svg2(path.join(path2.svgs.index, "normal-2.svg"));
					var svg = instance.svg;
					var current = { width: 24, height: 24 }; //576
					assert.deepEqual(
						svg.dimensions(),
						current,
						"svg dimensions and expected do not match"
					);
					svg.resize({ width: 48, height: Svg2.AUTO });
					assert.deepEqual(
						svg.dimensions(),
						{ width: 48, height: 48 }, //10000
						"svg dimensions did not update correctly"
					);
					var scale = instance.output.resize.scale;
					assert.equal(scale, 2, "svg did not scale correctly");
				});
				it(`can adjust height with AUTO width (even)`, () => {
					var instance = Svg2(path.join(path2.svgs.index, "normal-2.svg"));
					var svg = instance.svg;
					var current = { width: 24, height: 24 };
					assert.deepEqual(
						svg.dimensions(),
						current,
						"svg dimensions and expected do not match"
					);
					svg.resize({ width: Svg2.AUTO, height: 144 });
					assert.deepEqual(
						svg.dimensions(),
						{ width: 144, height: 144 },
						"svg dimensions did not update correctly"
					);
					var scale = instance.output.resize.scale;
					assert.equal(scale, 6, "svg did not scale correctly");
				});
				it(`can adjust width with AUTO height (uneven) (positive change)`, () => {
					var instance = Svg2(
						path.join(path2.svgs.index, "with-uneven-px-dimensions.svg")
					);
					var svg = instance.svg;
					var current = { width: 19, height: 13.444 };
					assert.deepEqual(
						svg.dimensions(),
						current,
						"svg dimensions and expected do not match"
					);
					svg.resize({ width: 200, height: Svg2.AUTO });
					assert.deepEqual(
						svg.dimensions(),
						{ width: 200, height: 141.51578947368424 },
						"svg dimensions did not update correctly"
					);
				});
				it(`can adjust height with AUTO width (uneven) (positive change)`, () => {
					var instance = Svg2(
						path.join(path2.svgs.index, "with-uneven-px-dimensions.svg")
					);
					var svg = instance.svg;
					var current = { width: 19, height: 13.444 };
					assert.deepEqual(
						svg.dimensions(),
						current,
						"svg dimensions and expected do not match"
					);
					svg.resize({ width: Svg2.AUTO, height: 50 });
					assert.deepEqual(
						svg.dimensions(),
						{ width: 70.66349300803333, height: 50 },
						"svg dimensions did not update correctly"
					);
				});
				it(`can adjust width with AUTO height (uneven) (negetive change)`, () => {
					var instance = Svg2(
						path.join(path2.svgs.index, "with-uneven-px-dimensions.svg")
					);
					var svg = instance.svg;
					var current = { width: 19, height: 13.444 };
					assert.deepEqual(
						svg.dimensions(),
						current,
						"svg dimensions and expected do not match"
					);
					svg.resize({ width: 190, height: Svg2.AUTO });
					assert.deepEqual(
						svg.dimensions(),
						{ width: 190, height: 134.44 },
						"svg dimensions did not update correctly"
					);
				});
				it(`can adjust height with AUTO width (uneven) (negetive change)`, () => {
					var instance = Svg2(
						path.join(path2.svgs.index, "with-uneven-px-dimensions.svg")
					);
					var svg = instance.svg;
					var current = { width: 19, height: 13.444 };
					assert.deepEqual(
						svg.dimensions(),
						current,
						"svg dimensions and expected do not match"
					);
					svg.resize({ width: Svg2.AUTO, height: 40 });
					assert.deepEqual(
						svg.dimensions(),
						{ width: 56.53079440642666, height: 40 },
						"svg dimensions did not update correctly"
					);
				});
				it(`can scale height and width (even)`, () => {
					var instance = Svg2(path.join(path2.svgs.index, "normal-2.svg"));
					var svg = instance.svg;
					var current = { width: 24, height: 24 };
					assert.deepEqual(
						svg.dimensions(),
						current,
						"svg dimensions and expected do not match"
					);
					svg.resize(2);
					assert.deepEqual(
						svg.dimensions(),
						{ width: 48, height: 48 },
						"svg dimensions did not update correctly"
					);
				});
				it(`can scale height and width (uneven)`, () => {
					var instance = Svg2(
						path.join(path2.svgs.index, "with-uneven-px-dimensions.svg")
					);
					var svg = instance.svg;
					var current = { width: 19, height: 13.444 };
					assert.deepEqual(
						svg.dimensions(),
						current,
						"svg dimensions and expected do not match"
					);
					svg.resize(2);
					assert.deepEqual(
						svg.dimensions(),
						{ width: 38, height: 26.888 },
						"svg dimensions did not update correctly"
					);
				});
			});
		});
		describe("svg.html()", () => {
			describe("- results", () => {
				it(`outputs a valid SVG html string`, () => {
					var instance = Svg2(path.join(path2.svgs.index, "normal-2.svg"));
					var svg = instance.svg;
					assert.isTrue(is.svg(svg.html()));
				});
			});
		});
		describe("svg.element()", () => {
			describe("- results", () => {
				it(`outputs a valid SVG element`, () => {
					var instance = Svg2(path.join(path2.svgs.index, "normal-2.svg"));
					var svg = instance.svg;
					assert.equal(svg.element().constructor.name, "SVGSVGElement");
				});
			});
		});
		describe("svg.dimensionToPx()", () => {
			describe("- arguments", () => {
				describe("[input]", () => {
					var data = [
            "number",
						"valid-svg-dimension-string-number",
						"valid-svg-dimension-px",
						"valid-svg-dimension-em",
						"valid-svg-dimension-rem",
					];
					// throws with invalid input parameter
					inputs.invalid(data).forEach((input) => {
						it(`throws with invalid input parameter (${input.description})`, () => {
							var instance = Svg2(path.join(path2.svgs.index, "normal-2.svg"));
							var svg = instance.svg;
							assert.throws(() => svg.dimensionToPx(input.data), TypeError);
						});
					});
					// does not throw with valid input parameter
					inputs.valid(data).forEach((input) => {
						it(`does not throw with valid input parameter (${input.description})`, () => {
							var instance = Svg2(path.join(path2.svgs.index, "normal-2.svg"));
							var svg = instance.svg;
							assert.doesNotThrow(() => svg.dimensionToPx(input.data), Error);
						});
					});
				});
			});
			describe("- results", () => {
				// check conversion
				var instance = Svg2(path.join(path2.svgs.index, "normal-2.svg"));
				var svg = instance.svg;
				it("can convert raw numbers to pixels", () => {
					assert.equal(svg.dimensionToPx("233"), 233);
				});
				it("can convert px units to pixels", () => {
					assert.equal(svg.dimensionToPx("281px"), 281);
				});
				it("can convert em units to pixels", () => {
					assert.equal(svg.dimensionToPx("5.1em"), 81.6);
				});
				it("can convert rem units to pixels", () => {
					assert.equal(svg.dimensionToPx("2.8rem"), 44.8);
				});
				it("outputs a number", () => {
					assert.equal(typeof svg.dimensionToPx("100px"), "number");
				});
			});
		});
	});
});
