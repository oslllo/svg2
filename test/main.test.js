"use strict";

const fs = require("fs");
const Svg2 = require("..");
const path = require("path");
const { assert } = require("chai");
const validator = require("validator");

const asserts = {
    svgs: path.resolve("test/asserts/svgs"),
    resized: path.resolve("test/asserts/resized"),
    converted: path.resolve("test/asserts/converted"),
};
var sources = fs.readdirSync(asserts.svgs);
var destination = asserts.converted;

describe("getDimensions()", () => {
	for (var i = 0; i < sources.length; i++) {
		var source = sources[i];
		it(`can get dimensions for ${source}`, () => {
			var svg = new Svg2(path.join(asserts.svgs, source));
			assert.deepEqual(svg.getDimensions(), { width: 24, height: 24 });
		});
	}
});

var source = path.join(asserts.svgs, sources[0]);

describe("toUri()", () => {
    it("can ouput a valid dataURI string", async () => {
        var svg = new Svg2(source);
        var uri = await svg.toUri();
        assert.equal(validator.isDataURI(uri), true);
    });
    it("can output a valid dataURI base64 string", async () => {
        var svg = new Svg2(source);
        var base64 = await svg.toUri({ mime: Svg2.jimp.MIME_PNG, base64only: true });
        assert.equal(validator.isBase64(base64), true);
    });
});

describe("setDimensions()", () => {
    it("can set SVG dimensions", async () => {
        var svg = new Svg2(source);
        var dimensions = { width: 240, height: 240 };
        await svg.setDimensions(dimensions);
        assert.deepEqual(svg.getDimensions(), dimensions);
    });
    it("can export a resized SVG", async () => {
        var svg = new Svg2(source);
        var name = "500x500.png";
        var destination = path.resolve(path.join(asserts.resized, name));
        var dimensions = { width: 500, height: 500 };
        await svg.setDimensions(dimensions);
        await svg.toPng();
        await svg.toFile(destination);
        var resized = await Svg2.jimp.read(destination);
        var rb = resized.bitmap;
        assert.deepEqual({ width: rb.width, height: rb.height }, dimensions);
    });
});

describe("toElement()", () => {
    it("can convert SVG string to SVGSVGElement", async() => {
        var svg = new Svg2(source);
        var element = svg.toElement();
        assert.equal(element.constructor.name, "SVGSVGElement");
    });
});

describe("toJpeg()", () => {
    it(`can convert SVG to a jpeg image and save to path`, async () => {
        var name = "svg.jpg";
        var svg = new Svg2(source);
        await svg.toJpeg();
        await svg.toFile(path.join(destination, name));
        assert.equal(fs.existsSync(path.join(asserts.converted, name)), true);
    })
});

describe("toPng()", () => {
    it(`can convert SVG to a png image and save to path`, async () => {
        var name = "svg.png";
        var svg = new Svg2(source);
        await svg.toPng();
        await svg.toFile(path.join(destination, name));
        assert.equal(fs.existsSync(path.join(asserts.converted, name)), true);
    })
});

describe("toBmp()", () => {
    it(`can convert SVG to a bmp image and save to path`, async () => {
        var name = "svg.bmp";
        var svg = new Svg2(source);
        await svg.toBmp();
        await svg.toFile(path.join(destination, name));
        assert.equal(fs.existsSync(path.join(asserts.converted, name)), true);
    })
});

describe("toTiff()", () => {
    it(`can convert SVG to a png image and save to path`, async () => {
        var name = "svg.tiff";
        var svg = new Svg2(source);
        await svg.toTiff();
        await svg.toFile(path.join(destination, name));
        assert.equal(fs.existsSync(path.join(asserts.converted, name)), true);
    })
});
