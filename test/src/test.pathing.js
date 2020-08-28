"use strict";

const fs = require("fs");
const path = require("path");
const Svg2 = require("../../src");
const looksame = require("looks-same");
const is = require("../../src/validate");
const { assert, expect } = require("chai").use(require("chai-as-promised"));

describe("pathing", () => {
	it(`can process image with (relative paths)`, (done) => {
		var source = "test/assets/svgs/normal.svg";
        var destination = "test/assets/exported/relative.png";
        var expected = "test/assets/expected/relative.png";
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
		var source = path.resolve("test/assets/svgs/normal.svg");
        var destination = path.resolve("test/assets/exported/absolute.png");
        var expected = path.resolve("test/assets/expected/absolute.png");
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
