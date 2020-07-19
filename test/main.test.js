"use strict";

const fs = require("fs");
const Svg2 = require("..");
const path = require("path");
const core = require("../src/core");
const looksame = require("looks-same");
const validator = require("validator");
const validate = require("../src/validate");
const { assert, expect } = require("chai").use(require("chai-as-promised"));

const asserts = {
	svgs: path.resolve("test/asserts/svgs"),
    resized: path.resolve("test/asserts/resized"),
    exported: path.resolve("test/asserts/exported"),
	expected: path.resolve("test/asserts/expected"),
    converted: path.resolve("test/asserts/converted"),
};
var sources = fs.readdirSync(asserts.svgs);
var destination = asserts.converted;

// core.js
describe("core.js", () => {
	describe("convertToPx()", () => {
		it("can convert raw numbers to pixels", () => {
			assert.equal(core.convertToPx("233"), 233);
		});
		it("can convert px units to pixels", () => {
			assert.equal(core.convertToPx("281px"), 281);
		});
		it("can convert em units to pixels", () => {
			assert.equal(core.convertToPx("5.1em"), 81.6);
		});
		it("can convert rem units to pixels", () => {
			assert.equal(core.convertToPx("2.8rem"), 44.8);
		});
		it("outputs a number", () => {
			assert.equal(typeof core.convertToPx("100px"), "number");
		});
		var invalidInputs = [
			{
				name: "empty array",
				data: new Array(),
			},
			{
				name: "empty object",
				data: new Object(),
			},
			{
				name: "boolean",
				data: Boolean(true),
			},
			{
				name: "undefined",
				data: undefined,
			},
		];
		invalidInputs.forEach((input) => {
			it(`throws with invalid input (${input.name})`, () => {
				assert.throws(() => core.convertToPx(input.data), TypeError);
			});
		});
	});
	describe("setOptions()", () => {
		var invalidInputs = [
			{
				name: "empty array",
				data: new Array(),
			},
			{
				name: "boolean",
				data: Boolean(true),
			},
			{
				name: "undefined",
				data: undefined,
			},
			{
				name: "string",
				data: "input",
			},
			{
				name: "number",
				data: 123,
			},
		];
		invalidInputs.forEach((input) => {
			it(`throws with invalid preset input (${input.name})`, () => {
				assert.throws(() => core.setOptions(input.data, {}), TypeError);
			});
		});
		invalidInputs.forEach((input) => {
			if (input.data !== undefined) {
				it(`throws with invalid options input (${input.name})`, () => {
					assert.throws(() => core.setOptions({}, input.data), TypeError);
				});
			}
		});
	});
});

describe("index.js", () => {
	describe("Svg2()", () => {
		var invalidInputs = [
			{
				name: "invalid buffer",
				data: Buffer.from("invalid buffer"),
			},
			{
				name: "empty array",
				data: new Array(),
			},
			{
				name: "boolean",
				data: Boolean(true),
			},
			{
				name: "undefined",
				data: undefined,
			},
			{
				name: "object",
				data: new Object(),
			},
			{
				name: "number",
				data: 123,
			},
		];
		invalidInputs.forEach((input) => {
			if (input.data !== undefined) {
				it(`throws with invalid input parameter (${input.name})`, () => {
					assert.throws(() => new Svg2(input.data), TypeError);
				});
			}
		});
		var validInputs = [
			{
				name: "SVG string",
				data: fs.readFileSync(path.join(asserts.svgs, "normal.svg"), "utf-8"),
			},
			{
				name: "SVG buffer",
				data: fs.readFileSync(path.join(asserts.svgs, "normal.svg")),
			},
		];
		validInputs.forEach((input) => {
			if (input.data !== undefined) {
				it(`does not throw with valid input parameter (${input.name})`, () => {
					assert.doesNotThrow(() => new Svg2(input.data), TypeError);
				});
			}
		});
	});

	describe("resize()", () => {
		it("can set SVG dimensions with both attributes", async () => {
			var svg = new Svg2(source);
			var dimensions = { width: 240, height: 240 };
			await svg.resize(dimensions);
			assert.deepEqual(svg.getDimensions(), dimensions);
		});
		it("can set SVG dimensions with one attribute", async () => {
			var svg = new Svg2(source);
			var dimensions = { height: 400 };
			await svg.resize(dimensions);
			assert.deepEqual(svg.getDimensions(), { width: 400, height: 400 });
		});
		it("can export a resized SVG", async () => {
			var svg = new Svg2(source);
			var name = "500x500.png";
			var destination = path.resolve(path.join(asserts.resized, name));
			var dimensions = { width: 500, height: 500 };
			await svg.resize(dimensions);
			await svg.png();
			await svg.toFile(destination);
			var resized = await Svg2.jimp.read(destination);
			var rb = resized.bitmap;
			assert.deepEqual({ width: rb.width, height: rb.height }, dimensions);
		});
		it("can export a resized SVG that looks correct", (done) => {
            var name = "500x500.png";
            looksame(
                path.join(asserts.resized, name),
                path.join(asserts.expected, name),
                { strict: true },
                (error, data) => {
                    assert.isTrue(data.equal);
                    error ? done(error) : done();
                }
            );
		});
		var invalidInputs = [
			{
				name: "empty array",
				data: new Array(),
			},
			{
				name: "boolean",
				data: Boolean(true),
			},
			{
				name: "undefined",
				data: undefined,
			},
			{
				name: "string",
				data: "input",
			},
			{
				name: "number",
				data: 123,
			},
		];
		invalidInputs.forEach((input) => {
			it(`throws with invalid dimensions parameter (${input.name})`, async () => {
				var svg = new Svg2(source);
				return expect(svg.resize(input.data)).to.be.rejectedWith(
					TypeError
				);
			});
		});
	});

	describe("getDimensions()", () => {
		it("throws when SVG does not have width and height attributes or a viewBox", () => {
			var svg = new Svg2(
				path.join(asserts.svgs, "without-viewbox-or-dimension-attributes.svg")
			);
			assert.throws(() => svg.getDimensions(), Error);
		});
		var svgs = [
			{
				name: "normal.svg",
				dimensions: { width: 48, height: 48 },
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
				name: "with-viewbox-only.svg",
				dimensions: { width: 24, height: 24 },
			},
			{
				name: "with-rem-dimensions.svg",
				dimensions: { width: 120, height: 120 },
			},
		];
		svgs.forEach((svg) => {
			var source = svg;
			var name = source.name;
			it(`can get dimensions for ${name}`, () => {
				var svg = new Svg2(path.join(asserts.svgs, name));
				assert.deepEqual(svg.getDimensions(), source.dimensions);
			});
		});
	});

	var source = path.join(asserts.svgs, sources[0]);

	describe("uri()", () => {
		it("can ouput a valid dataURI string", async () => {
			var svg = new Svg2(source);
			var uri = await svg.uri();
			assert.equal(validator.isDataURI(uri), true);
		});
		it("can output a valid dataURI base64 string", async () => {
			var svg = new Svg2(source);
			var base64 = await svg.uri({
				mime: Svg2.jimp.MIME_PNG,
				base64only: true,
			});
			assert.equal(validator.isBase64(base64), true);
		});
		it("rejects when error is thrown", () => {
			var svg = new Svg2(
				path.join(asserts.svgs, "without-viewbox-or-dimension-attributes.svg")
			);
			return expect(svg.uri()).to.be.rejectedWith(Error);
		});
	});

	describe("element()", () => {
		it("can convert a SVG string into a SVGSVGElement instance", async () => {
			var svg = new Svg2(source);
			var element = svg.element();
			assert.equal(element.constructor.name, "SVGSVGElement");
		});
	});

	describe("jpeg()", () => {
		it(`can convert SVG to a jpeg image and save to path`, async () => {
			var name = "svg.jpg";
			var svg = new Svg2(source);
			await svg.jpeg();
			await svg.toFile(path.join(destination, name));
			assert.equal(fs.existsSync(path.join(asserts.converted, name)), true);
		});
		it("rejects when error is thrown", () => {
			var svg = new Svg2(
				path.join(asserts.svgs, "without-viewbox-or-dimension-attributes.svg")
			);
			return expect(svg.jpeg()).to.be.rejectedWith(Error);
		});
	});

	describe("png()", () => {
		it(`can convert SVG to a png image and save to path`, async () => {
			var name = "svg.png";
			var svg = new Svg2(source);
			await svg.png();
			await svg.toFile(path.join(destination, name));
			assert.equal(fs.existsSync(path.join(asserts.converted, name)), true);
		});
		it("rejects when error is thrown", () => {
			var svg = new Svg2(
				path.join(asserts.svgs, "without-viewbox-or-dimension-attributes.svg")
			);
			return expect(svg.png()).to.be.rejectedWith(Error);
		});
	});

	describe("bmp()", () => {
		it(`can convert SVG to a bmp image and save to path`, async () => {
			var name = "svg.bmp";
			var svg = new Svg2(source);
			await svg.bmp();
			await svg.toFile(path.join(destination, name));
			assert.equal(fs.existsSync(path.join(asserts.converted, name)), true);
		});
		it("rejects when error is thrown", () => {
			var svg = new Svg2(
				path.join(asserts.svgs, "without-viewbox-or-dimension-attributes.svg")
			);
			return expect(svg.bmp()).to.be.rejectedWith(Error);
		});
	});

	describe("tiff()", () => {
		it(`can convert SVG to a png image and save to path`, async () => {
			var name = "svg.tiff";
			var svg = new Svg2(source);
			await svg.tiff();
			await svg.toFile(path.join(destination, name));
			assert.equal(fs.existsSync(path.join(asserts.converted, name)), true);
		});
		it("rejects when error is thrown", () => {
			var svg = new Svg2(
				path.join(asserts.svgs, "without-viewbox-or-dimension-attributes.svg")
			);
			return expect(svg.tiff()).to.be.rejectedWith(Error);
		});
	});

	describe("toFile()", () => {
        var invalidInputs = [
			{
				name: "empty array",
				data: new Array(),
			},
			{
				name: "boolean",
				data: Boolean(true),
			},
			{
				name: "undefined",
				data: undefined,
			},
			{
				name: "object",
				data: new Object(),
			},
			{
				name: "number",
				data: 123,
			},
        ];
        invalidInputs.forEach((input) => {
            it(`throws with invalid destination parameter (${input.name})`, async () => {
                var svg = new Svg2(source);
                await svg.png();
                return expect(svg.toFile(input.data)).to.be.rejectedWith(TypeError);
            });
        });
        it("can export image if internal output is a buffer", async () => {
            var svg = new Svg2(source);
            var destination = path.join(asserts.exported, "export.png");
            try {
                await svg.png();
                await svg.toBuffer();
                await svg.toFile(destination);
            } catch (err) {
                throw err;
            }
        });
    });
    describe("toBuffer()", () => {
        it("can convert none buffer output to a buffer", async () => {
            var svg = new Svg2(source);
            await svg.string();
            assert.isFalse(Buffer.isBuffer(svg.output));
            await svg.toBuffer();
            assert.isTrue(Buffer.isBuffer(svg.output));
        });
        it("can convert jimp instance output to a buffer", async () => {
            var svg = new Svg2(source);
            await svg.png();
            assert.isTrue(svg.output instanceof Svg2.jimp);
            await svg.toBuffer();
            assert.isTrue(Buffer.isBuffer(svg.output));
        });
        it("throws with invalid output", () => {
            var svg = new Svg2(source);
            return expect(svg.toBuffer()).to.be.rejectedWith(Error);
        });
    });
});

// validate.js
describe("validate.js", () => {
	describe("isSvg()", () => {
		var isSvg = validate.isSvg;
		it("can identify valid SVGs", () => {
			// assert.isTrue(isSvg(fs.readFileSync('fixtures/fixture.svg')));
			assert.isTrue(
				isSvg(
					'<svg width="100" height="100" viewBox="0 0 30 30" version="1.1"></svg>'
				)
			);
			assert.isTrue(
				isSvg(
					'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg></svg>'
				)
			);
			assert.isTrue(
				isSvg(
					'<?xml version="1.0" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg></svg>'
				)
			);
			assert.isTrue(
				isSvg(
					'<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" [<!ENTITY ns_flows "http://ns.adobe.com/Flows/1.0/">]><svg></svg>'
				)
			);
			assert.isTrue(
				isSvg(
					'<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" [ <!ENTITY ns_flows "http://ns.adobe.com/Flows/1.0/"> <!ENTITY ns_custom "http://ns.adobe.com/GenericCustomNamespace/1.0/"> ]><svg></svg>'
				)
			);
			assert.isTrue(isSvg("<svg></svg>    "));
			assert.isTrue(isSvg("    <svg></svg>"));
			assert.isTrue(isSvg("<svg>\n</svg>"));
			assert.isTrue(isSvg("<!--unicorn--><svg>\n</svg><!--cake-->"));
			assert.isTrue(isSvg("<svg/>"));
			assert.isTrue(
				isSvg(`
        <!-- Generator: Some Graphic Design Software  -->
        <svg version="1.1">
        </svg>
        `)
			);
		});
		it("can identify invalid SVGs", () => {
			// assert.isFalse(isSvg(fs.readFileSync('fixtures/fixture.jpg')));
			assert.isFalse(isSvg("this is not svg, but it mentions <svg> tags"));
			assert.isFalse(isSvg("<svg> hello I am an svg oops maybe not"));
			assert.isFalse(isSvg("<svg></svg> this string starts with an svg"));
			assert.isFalse(isSvg("this string ends with an svg <svg></svg>"));
			assert.isFalse(isSvg("<div><svg></svg>"));
			assert.isFalse(isSvg("<div><svg></svg></div>"));
			assert.isFalse(
				isSvg("this string contains an svg <svg></svg> in the middle")
			);
			assert.isFalse(isSvg(fs.readFileSync("README.md")));
			assert.isFalse(isSvg(fs.readFileSync("src/index.js")));
			assert.isFalse(isSvg());
		});

		it("supports non-english characters", () => {
			assert.isTrue(
				isSvg(`<svg xmlns="http://www.w3.org/2000/svg"
                 width="100%" height="100%" viewBox="0 0 400 400"
                 direction="rtl" xml:lang="fa">
              <title direction="ltr" xml:lang="en">Right-to-left Text</title>
              <desc direction="ltr" xml:lang="en">
                A simple example for using the 'direction' property in documents
                that predominantly use right-to-left languages.
              </desc>
              <text x="200" y="200" font-size="20">داستان SVG 1.1 SE طولا ني است.</text>
            </svg>`)
			);
		});
		it("supports markup inside Entity tags", () => {
			assert.isTrue(
				isSvg(
					"<?xml version=\"1.0\" encoding=\"utf-8\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\" [ <!ENTITY Smile \" <rect x='.5' y='.5' width='29' height='39' fill='black' stroke='red'/> <g transform='translate(0, 5)'> <circle cx='15' cy='15' r='10' fill='yellow'/><circle cx='12' cy='12' r='1.5' fill='black'/><circle cx='17' cy='12' r='1.5' fill='black'/><path d='M 10 19 L 15 23 20 19' stroke='black' stroke-width='2'/></g>\"> ]><svg width=\"850px\" height=\"700px\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><g transform=\"matrix(16,0,0,16,0,0)\">&Smile;</g></svg>"
				)
			);
			assert.isTrue(
				isSvg(
					"<?xml version=\"1.0\" encoding=\"utf-8\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\" [ <!ENTITY Smile \" <rect x='.5' y='.5' width='29' height='39' fill='black' stroke='red'/> <g transform='translate(0, 5)'> <circle cx='15' cy='15' r='10' fill='yellow'/><circle cx='12' cy='12' r='1.5' fill='black'/><circle cx='17' cy='12' r='1.5' fill='black'/><path d='M 10 19 L 15 23 20 19' stroke='black' stroke-width='2'/></g>\"> <!ENTITY ns_flows \"http://ns.adobe.com/Flows/1.0/\">]><svg width=\"850px\" height=\"700px\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><g transform=\"matrix(16,0,0,16,0,0)\">&Smile;</g></svg>"
				)
			);
			assert.isTrue(
				isSvg(`
            <?xml version="1.0" encoding="utf-8"?>
                <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" [
                    <!ENTITY Orange "<g transform='translate(0, 5)'><circle cx='12' cy='12' r='1.5' fill='orange'/><path d='M 10 19 L 15 23 20 19' stroke='orange' stroke-width='2'/></g>">
                    <!ENTITY Melon "<g transform='translate(10, 10)'><circle cx='12' cy='12' r='1.5' fill='yellow'/><path d='M 10 19 L 15 23 20 19' stroke='yellow' stroke-width='2'/></g>">
                ]>
            <svg width="850px" height="700px" version="1.1"
                xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(16,0,0,16,0,0)">
                     &Melon;
                 </g>
                 <g transform="matrix(32,0,0,32,0,0)">
                     &Orange;
                 </g>
            </svg>`)
			);
		});
	});
});
