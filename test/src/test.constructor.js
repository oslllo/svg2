"use strict";

const Svg2 = require("../../src");
const { path2, inputs } = require("./helper");
const { assert, expect } = require("chai").use(require("chai-as-promised"));

describe("constructor.js", () => {
	describe("new Svg2()", () => {
		describe("svg2.check()", () => {
			describe("- arguments", () => {
				describe("[input]", () => {
					var data = [
						"valid-svg-string",
						"path-to-valid-svg",
						"valid-svg-in-buffer",
					];
					inputs.invalid(data).forEach((input) => {
						it(`throws with invalid input parameter (${input.description})`, () => {
							assert.throws(() => Svg2(input.data), TypeError);
						});
					});
					inputs.valid(data).forEach((input) => {
						it(`does not throw with valid input parameter (${input.description})`, () => {
							assert.doesNotThrow(() => Svg2(input.data), Error);
						});
					});
				});
			});
		});
		describe("svg2.blank()", () => {
			describe("- arguments", () => {
				describe("[dimensions]", () => {

				});
				describe("[background]", () => {
					
				});
			});
			describe("- results", () => {
				
			});
		});
	});
});
