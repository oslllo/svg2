"use strict";

const Svg2 = require("..");
const path = require("path");
const jimp = require("jimp");
const fs = require("fs-extra");
const looksame = require("looks-same");
const validator = require("validator");
const helper = require("../src/helper");
const validate = require("../src/validate");
const { assert, expect } = require("chai").use(require("chai-as-promised"));

const assets = {
	svgs: path.resolve("test/assets/svgs"),
	resized: path.resolve("test/assets/resized"),
	exported: path.resolve("test/assets/exported"),
	expected: path.resolve("test/assets/expected"),
	converted: path.resolve("test/assets/converted"),
};
var sources = fs.readdirSync(assets.svgs);
var destination = assets.converted;
["resized", "exported", "converted"].forEach((dir) => {
	fs.emptyDirSync(assets[dir]);
});

// helper.js
describe("helper.js", () => {
	describe("toPx()", () => {
		it("can convert raw numbers to pixels", () => {
			assert.equal(helper.toPx("233"), 233);
		});
		it("can convert px units to pixels", () => {
			assert.equal(helper.toPx("281px"), 281);
		});
		it("can convert em units to pixels", () => {
			assert.equal(helper.toPx("5.1em"), 81.6);
		});
		it("can convert rem units to pixels", () => {
			assert.equal(helper.toPx("2.8rem"), 44.8);
		});
		it("outputs a number", () => {
			assert.equal(typeof helper.toPx("100px"), "number");
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
				assert.throws(() => helper.toPx(input.data), TypeError);
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
				assert.throws(() => helper.setOptions(input.data, {}), TypeError);
			});
		});
		invalidInputs.forEach((input) => {
			if (input.data !== undefined) {
				it(`throws with invalid options input (${input.name})`, () => {
					assert.throws(() => helper.setOptions({}, input.data), TypeError);
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
					assert.throws(() => Svg2(input.data), Error);
				});
			}
		});
		var validInputs = [
			{
				name: "SVG string",
				data: fs.readFileSync(path.join(assets.svgs, "normal.svg"), "utf-8"),
			},
			{
				name: "SVG buffer",
				data: fs.readFileSync(path.join(assets.svgs, "normal.svg")),
			},
		];
		validInputs.forEach((input) => {
			if (input.data !== undefined) {
				it(`does not throw with valid input parameter (${input.name})`, () => {
					assert.doesNotThrow(() => Svg2(input.data), Error);
				});
			}
		});
	});

	describe("svg.resize()", () => {
		it("can set SVG dimensions with both attributes", async () => {
			var dimensions = { width: 240, height: 240 };
			var instance = Svg2(source);
			instance.svg.resize(dimensions);
			assert.deepEqual(instance.svg.dimensions(), dimensions);
		});
		it("can set SVG dimensions with one attribute", async () => {
			var dimensions = { height: 400, width: Svg2.AUTO };
			var instance = Svg2(source);
			instance.svg.resize(dimensions);
			assert.deepEqual(instance.svg.dimensions(), { width: 400, height: 400 });
		});
		it("can export a resized SVG", async () => {
			var dimensions = { width: 500, height: 500 };
			var name = "500x500.png";
			var destination = path.resolve(path.join(assets.resized, name));
			await Svg2(source).svg.resize(dimensions).png().toFile(destination);
			var resized = await jimp.read(destination);
			var rb = resized.bitmap;
			assert.deepEqual({ width: rb.width, height: rb.height }, dimensions);
		});
		it("can export a resized SVG that looks correct", (done) => {
			var name = "500x500.png";
			looksame(
				path.join(assets.resized, name),
				path.join(assets.expected, name),
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
			}
		];
		invalidInputs.forEach((input) => {
			it(`throws with invalid dimensions parameter (${input.name})`, async () => {
				var instance = Svg2(source);
				assert.throws(() => instance.svg.resize(input.data), TypeError);
			});
		});
	});

	describe("svg.dimensions()", () => {
		it("throws when SVG does not have width and height attributes or a viewBox", () => {
			var instance = Svg2(
				path.join(assets.svgs, "without-viewbox-or-dimension-attributes.svg")
			);
			assert.throws(() => instance.svg.dimensions(), Error);
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
				var instance = Svg2(path.join(assets.svgs, name));
				assert.deepEqual(instance.svg.dimensions(), source.dimensions);
			});
		});
	});

	var source = path.join(assets.svgs, sources[0]);

	describe("toUri()", () => {
		it("can ouput a valid dataURI string", async () => {
			var uri = await Svg2(source).toUri();
			assert.equal(validator.isDataURI(uri), true);
		});
		it("can output a valid dataURI base64 string", async () => {
			var base64 = await Svg2(source).toUri({ base64Only: true });
			assert.equal(validator.isBase64(base64), true);
		});
		it("rejects when error is thrown", () => {
			var svg = Svg2(
				path.join(assets.svgs, "without-viewbox-or-dimension-attributes.svg")
			);
			assert.throws(() => svg.toUri(), Error);
		});
	});

	describe("element()", () => {
		it("can convert a SVG string into a SVGSVGElement instance", async () => {
			var element = Svg2(source).toElement();
			assert.equal(element.constructor.name, "SVGSVGElement");
		});
	});

	describe("jpeg()", () => {
		it(`can convert SVG to a jpeg image and save to path`, async () => {
			var name = "svg.jpeg";
			var svg = await Svg2(source).jpeg().toFile(path.join(destination, name));
			assert.equal(fs.existsSync(path.join(assets.converted, name)), true);
		});
		it("rejects when error is thrown", () => {
			var svg = Svg2(
				path.join(assets.svgs, "without-viewbox-or-dimension-attributes.svg")
			);
			return expect(svg.jpeg().toBuffer()).to.be.rejectedWith(Error);
		});
	});

	describe("png()", () => {
		it(`can convert SVG to a png image and save to path`, async () => {
			var name = "svg.png";
			var svg = await Svg2(source).png().toFile(path.join(destination, name));
			assert.equal(fs.existsSync(path.join(assets.converted, name)), true);
		});
		it("rejects when error is thrown", () => {
			var svg = Svg2(
				path.join(assets.svgs, "without-viewbox-or-dimension-attributes.svg")
			);
			return expect(svg.png().toBuffer()).to.be.rejectedWith(Error);
		});
	});

	describe("bmp()", () => {
		it(`can convert SVG to a bmp image and save to path`, async () => {
			var name = "svg.bmp";
			var svg = await Svg2(source).bmp().toFile(path.join(destination, name));
			assert.isTrue(fs.existsSync(path.join(assets.converted, name)));
		});
		it("rejects when error is thrown", () => {
			var svg = Svg2(
				path.join(assets.svgs, "without-viewbox-or-dimension-attributes.svg")
			);
			return expect(svg.bmp().toBuffer()).to.be.rejectedWith(Error);
		});
	});

	describe("tiff()", () => {
		it(`can convert SVG to a tiff image and save to path`, async () => {
			var name = "svg.tiff";
			var svg = await Svg2(source).tiff().toFile(path.join(destination, name));
			assert.isTrue(fs.existsSync(path.join(assets.converted, name)));
		});
		it("rejects when error is thrown", () => {
			var svg = Svg2(
				path.join(assets.svgs, "without-viewbox-or-dimension-attributes.svg")
			);
			return expect(svg.tiff().toBuffer()).to.be.rejectedWith(Error);
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
				var svg = Svg2(source).png();
				return expect(svg.toFile(input.data)).to.be.rejectedWith(TypeError);
			});
		});
		it("can export image to file if source is buffer", async () => {
			var svg = Svg2(fs.readFileSync(source));
			var destination = path.join(assets.exported, "export.png");
			return expect(svg.png().toFile(destination)).to.be.fulfilled;
		});
		it("can save image to path if source is buffer", async () => {
			var svg = Svg2(fs.readFileSync(source));
			var destination = path.join(assets.exported, "export.png");
			await svg.png().toFile(destination);
			assert.isTrue(fs.existsSync(destination));
		});
	});
	describe("toBuffer()", () => {
		it("can export image to buffer if source is a SVG string", async () => {
			var instance = Svg2(fs.readFileSync(source, "utf-8")).png();
			var buffer = await instance.toBuffer();
			assert.isTrue(Buffer.isBuffer(buffer));
		});
		// it("can convert jimp instance output to a buffer", async () => {
		// 	var svg = Svg2(source).png();
		// 	assert.isTrue(svg.output instanceof Svg2.jimp);
		// 	await svg.toBuffer();
		// 	assert.isTrue(Buffer.isBuffer(svg.output));
		// });
		// it("throws with invalid output", () => {
		// 	var svg = Svg2(source);
		// 	return expect(svg.toBuffer()).to.be.rejectedWith(Error);
		// });
	});
});

// validate.js
describe("validate.js", () => {
	describe("isSvg()", () => {
		var isSvg = validate.svg;
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
