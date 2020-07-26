"use strict";

const Svg2 = require("../../src");
const error = require("../../src/error");
const Option = require("../../src/option");
const { path2, inputs } = require("./helper");
const { assert, expect } = require("chai").use(require("chai-as-promised"));

describe("option.js", () => {
	describe("new Option()", () => {
		describe("option.get()", () => {
			describe("- arguments", () => {
				describe("[setting]", () => {
					var data = [];
					var option = new Option();
					// throws with invalid setting parameter
					inputs.invalid(data).forEach((input) => {
						it(`throws with invalid setting parameter (${input.description})`, () => {
							assert.throws(() => option.get(input.data), TypeError);
						});
					});
					// does not throw with valid setting parameter.
					data = Object.keys(option.data);
					data.forEach((input) => {
						it(`does not throw with valid setting parameter (${input})`, () => {
							assert.doesNotThrow(() => option.get(input), Error);
						});
					});
					// gets valid data
					it("gets valid option data", () => {
						var option = new Option();
						var setting = "png";
						assert.deepEqual(option.get(setting), option.data[setting]);
					});
				});
			});
		});
		describe("option.update()", () => {
			describe("- arguments", () => {
				describe("[option]", () => {
					var data = ["empty-object", "valid-option-update-object"];
					var option = new Option();
					// invalid data throws
					inputs.invalid(data).forEach((input) => {
						it(`throws with invalid option parameter (${input.description})`, () => {
							assert.throws(
								() => option.update("png", input.data),
								TypeError
								//! This was to make sure that we were testing the right parameter.
								// error.invalidParameterError("options", "object", input.data)
								// 	.message
							);
						});
					});
					// valid does not throw
					inputs.valid(data).forEach((input) => {
						it(`does not throw with valid options parameter (${input})`, () => {
							assert.doesNotThrow(
								() => option.update("png", input.data),
								Error
							);
						});
					});
					// can with update options
					it(`can update with valid options`, () => {
						var option = new Option();
						var setting = "png";
						var update = { transparent: true };
						assert.notDeepEqual(option.get(setting), update);
						option.update(setting, update);
						assert.deepEqual(option.get(setting), update);
                    });
                    // throws with invalid option properties
                    it(`throws with invalid option properties`, () => {
                        var option = new Option();
						var setting = "png";
						var update = { transparent: true, invalid: 123 };
                        assert.notDeepEqual(option.get(setting), update);
                        assert.throws(() => option.update(setting, update), TypeError);
                    });
				});
			});
		});
	});
});
