"use strict";

const fs = require("fs");
const path = require("path");
const Svg2 = require("../../src");
const looksame = require("looks-same");
const is = require("oslllo-validator");
const { path2 } = require("./helper");
const { assert, expect } = require("chai").use(require("chai-as-promised"));

describe("pathing", () => {
	it(`can process image with (relative paths)`, (done) => {
		var source = path.join(path2.svgs.index, "normal.svg");
        var destination = path.join(path2.generated.index, "relative.png");
        var expected = path.join(path2.expected.output.index, "relative.png");
		Svg2(source).png().toFile(destination).then(() => {
            assert.isTrue(fs.existsSync(destination), "exported image does not exist.");
            looksame(destination, expected, { strict: true }, (err, data) => {
                if (data) {
                    assert.isTrue(data.equal, "images are not equal");
                }
                done(err);
            });
        }).catch((err) => {
            done(err);
        });
    });
    it(`can process image with (absolute paths)`, (done) => {
        var source = path.join(path2.svgs.index, "normal.svg");
        var destination = path.join(path2.generated.index, "absolute.png");
        var expected = path.join(path2.expected.output.index, "absolute.png");
		Svg2(source).png().toFile(destination).then(() => {
            assert.isTrue(fs.existsSync(destination), "exported image does not exist.");
            looksame(destination, expected, { strict: true }, (err, data) => {
                if (data) {
                    assert.isTrue(data.equal, "images are not equal");
                }
                done(err);
            });
        }).catch((err) => {
            done(err);
        });
	});
  it(`can process image with (text)`, (done) => {
        var source = path.join(path2.svgs.index, "text.svg");
        var destination = path.join(path2.generated.index, "text.png");
        var expected = path.join(path2.expected.output.index, "text.png");
		Svg2(source).png().toFile(destination).then(() => {
            assert.isTrue(fs.existsSync(destination), "exported image does not exist.");
            looksame(destination, expected, { strict: true }, (err, data) => {
                if (data) {
                    assert.isTrue(data.equal, "images are not equal");
                }
                done(err);
            });
        }).catch((err) => {
            done(err);
        });
	});
});
