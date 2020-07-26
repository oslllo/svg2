"use strict";

const fs = require("fs");
const path = require("path");
const Svg2 = require("../../src");
const looksame = require("looks-same");
const validator = require("validator");
const { path2, inputs } = require("./helper");
const constants = require("../../src/constants");
const { assert, expect } = require("chai").use(require("chai-as-promised"));

const formats = constants.FORMATS;

describe("output.js", () => {
	describe("png()", () => {
		describe("- results", () => {
			it("can set instance output format to (png)", () => {
				var svg = Svg2(path.join(path2.svgs, "normal.svg"));
				var format = svg.output.format;
				assert.isUndefined(format, "output format is already set");
				svg.png();
				assert.equal(svg.output.format, formats.png);
			});
		});
	});
	describe("jpeg()", () => {
		describe("- results", () => {
			it("can set instance output format to (jpeg)", () => {
				var svg = Svg2(path.join(path2.svgs, "normal.svg"));
				var format = svg.output.format;
				assert.isUndefined(format, "output format is already set");
				svg.jpeg();
				assert.equal(svg.output.format, formats.jpeg);
			});
		});
	});
	describe("tiff()", () => {
		describe("- results", () => {
			it("can set instance output format to (tiff)", () => {
				var svg = Svg2(path.join(path2.svgs, "normal.svg"));
				var format = svg.output.format;
				assert.isUndefined(format, "output format is already set");
				svg.tiff();
				assert.equal(svg.output.format, formats.tiff);
			});
		});
	});
	describe("bmp()", () => {
		describe("- results", () => {
			it("can set instance output format to (bmp)", () => {
				var svg = Svg2(path.join(path2.svgs, "normal.svg"));
				var format = svg.output.format;
				assert.isUndefined(format, "output format is already set");
				svg.bmp();
				assert.equal(svg.output.format, formats.bmp);
			});
		});
	});
	describe("toElement()", () => {
		describe("- arguments", () => {
			describe("[input]", () => {
				it("can return svg instance element with no input parameter", () => {
					var source = path.join(path2.svgs, "normal.svg");
					var raw = fs.readFileSync(source, "utf-8");
					var svg = Svg2(source);
					var element = svg.toElement();
					assert.isTrue(
						element.constructor.name === "SVGSVGElement",
						"element is not an instance of SVGSVGElement"
					);
					assert.isTrue(
						svg.svg.html() === raw,
						"raw svg html does not match element html"
					);
				});
				it("can return svg element provided in input parameter", () => {
					var source = path.join(path2.svgs, "normal.svg");
					var raw = fs.readFileSync(source, "utf-8");
					var svg = Svg2(source);
					var element = svg.toElement(raw);
					assert.isTrue(
						element.constructor.name === "SVGSVGElement",
						"element is not an instance of SVGSVGElement"
					);
					assert.isTrue(
						element.outerHTML === raw,
						"raw svg html does not match element html"
					);
				});
			});
		});
    });
    describe("toUrl()", () => {
        describe("- arguments", () => {
            describe("[options]", () => {
                //* data type checks are handled by option.js so no need to check throws
                it("can set options", () => async () => {
                    var svg = Svg2(path.join(path2.svgs, "normal.svg"));
                    var current = svg.options.get("uri");
                    var update = { base64: true, mime: formats.jpeg };
                    assert.notDeepEqual(current, update, "new and old options match");
                    await svg.toUri(update);
                    current = svg.options.get("url");
                    assert.deepEqual(current, update);
                });
            });
            describe("[callback]", () => {
				var data = ["empty-function", "undefined"];
				// throws with invalid callback parameter
                inputs.invalid(data).forEach((input) => {
                    it(`throws with invalid callback parameter (${input.description})`, () => {
						var svg = Svg2(path.join(path2.svgs, "normal.svg"));
						assert.throws(() => svg.toUri({}, input.data), TypeError);
                    });
				});
				// throws with valid callback parameter
				inputs.valid(data).forEach((input) => {
					it(`does not throw with valid callback parameter (${input.description})`, () => {
						var svg = Svg2(path.join(path2.svgs, "normal.svg"));
						assert.doesNotThrow(() => svg.toUri({}, input.data), Error);
					});
				});
                it("does not return a promise when callback is defined", () => {
                    var svg = Svg2(path.join(path2.svgs, "normal.svg"));
                    var result = svg.toUri({}, (err, data) => {});
                    assert.isFalse(result instanceof Promise);
				});
				it("does not throw if callback parameter is defined without the options parameter", (done) => {
					var svg = Svg2(path.join(path2.svgs, "normal.svg"));
                    var result = svg.toUri((err, data) => {
						assert.isDefined(data, "did not return data");
						done(err);
					});
				});
            });
		});
		describe("- results", () => {
			it("can ouput a valid dataURI string (promise)", async () => {
				var uri = await Svg2(path.join(path2.svgs, "normal.svg")).toUri();
				assert.equal(validator.isDataURI(uri), true);
			});
			it("can ouput a valid dataURI string (callback)", (done) => {
				Svg2(path.join(path2.svgs, "normal.svg")).toUri((err, uri) => {
					assert.equal(validator.isDataURI(uri), true);
					done(err);
				});
			});
			it("can output a valid base64 string (promise)", async () => {
				var base64 = await Svg2(path.join(path2.svgs, "normal.svg")).toUri({ base64: true });
				assert.equal(validator.isBase64(base64), true);
			});
			it("can output a valid base64 string (callback)", (done) => {
				Svg2(path.join(path2.svgs, "normal.svg")).toUri({ base64: true }, (err, base64) => {
					assert.equal(validator.isBase64(base64), true);
					done(err);
				});
			});
			// TODO
			// it("rejects when error is thrown", () => {
			// 	var svg = Svg2(
			// 		path.join(assets.svgs, "without-viewbox-or-dimension-attributes.svg")
			// 	);
			// 	assert.throws(() => svg.toUri(), Error);
			// });
		});
	});
	describe("toBuffer()", () => {
		describe("- arguments", () => {
			describe("[callback]", () => {
				var data = ["empty-function", "undefined"];
				inputs.invalid(data).forEach((input) => {
					it(`throws with invalid callback paramater (${input.description})`, () => {
						var svg = Svg2(path.join(path2.svgs, "normal.svg"));
						assert.throws(() => svg.png().toBuffer(input.data));
					});
				});
				inputs.valid(data).forEach((input) => {
					it(`does not throw with valid callback parameter (${input.description})`, () => {
						var svg = Svg2(path.join(path2.svgs, "normal.svg"));
						assert.doesNotThrow(() => svg.png().toBuffer(input.data));
					});
				});
			});
		});
		describe("- results", () => {
			it(`can convert to png image and return buffer (promise)`, async () => {
			    var name = "svg.png";
			    var destination = path.join(path2.exported, name);
			    var svg = Svg2(path.join(path2.svgs, "normal.svg"));
			    var buffer = await svg.png().toBuffer();
			    assert.isTrue(Buffer.isBuffer(buffer), "did not return buffer");
			});
			it(`can convert to png image and return buffer (callback)`, (done) => {
			    var name = "svg.png";
			    var destination = path.join(path2.exported, name);
			    var svg = Svg2(path.join(path2.svgs, "normal.svg"));
			    svg.png().toBuffer((err, buffer) => {
					assert.isTrue(Buffer.isBuffer(buffer), "did not return buffer");
					done(err);
				});
			});
			it(`can convert to png image and return buffer image that looks correct`, (done) => {
				var error;
			    var name = "svg.png";
			    var destination = path.join(path2.exported, name);
			    var svg = Svg2(path.join(path2.svgs, "normal.svg"));
			    svg.png().toBuffer((err, buffer) => {
					error = err ? err : error;
					assert.isTrue(Buffer.isBuffer(buffer), "did not return buffer");
					looksame(buffer, path.join(path2.expected, "svg.png"), { strict: true }, (err, data) => {
						error = err ? err : error;
						assert.isTrue(data.equal, "images are not equal");
						done(error);
					});
				});
			});
		});
	});
});

// it(`can convert to png image and save to path (promise)`, async () => {
//     var name = "svg.png";
//     var destination = path.join(path2.exported, name);
//     var svg = Svg2(path.join(path2.svgs, "normal-2.svg"));
//     await svg.png().toFile(destination);
//     assert.isTrue(fs.existsSync(destination), "did not save image to path");
// });
// it(`can convert to png image and save to path (callback)`, (done) => {
//     var name = "svg.png";
//     var destination = path.join(path2.exported, name);
//     var svg = Svg2(path.join(path2.svgs, "normal.svg"));
//     svg.png().toFile(destination, (err) => {
//         assert.isFalse(err instanceof Error, "throw an error");
//         assert.isTrue(fs.existsSync(destination), "did not save image to path");
//         done();
//     });
// });
