"use strict";

const fs = require("fs");

/**
 * Is this value a binary?
 * @private
 */
const binary = function (val) {
	const isBuffer = Buffer.isBuffer(val);
	for (let i = 0; i < 24; i++) {
		const characterCode = isBuffer ? val[i] : val.charCodeAt(i);
		if (characterCode === 65533 || characterCode <= 8) {
			return true;
		}
	}
	return false;
};

/**
 * Is this value a valid svg?
 * @private
 */
const svg = function (val) {
	const htmlCommentRegex = /<!--([\s\S]*?)-->/g;
	const cleanEntities = (val) => {
		const entityRegex = /\s*<!Entity\s+\S*\s*(?:"|')[^"]+(?:"|')\s*>/gim;
		return val.replace(entityRegex, "");
	};
	const regex = /^\s*(?:<\?xml[^>]*>\s*)?(?:<!doctype svg[^>]*\s*(?:\[?(?:\s*<![^>]*>\s*)*\]?)*[^>]*>\s*)?(?:<svg[^>]*>[^]*<\/svg>|<svg[^/>]*\/\s*>)\s*$/i;
	return (
		Boolean(val) &&
		!binary(val) &&
		regex.test(cleanEntities(val.toString()).replace(htmlCommentRegex, ""))
	);
};

/**
 * Is this value a path to a file?
 * @private
 */
const pathToFile = function (val) {
	return fs.existsSync(val) && fs.lstatSync(val).isFile();
};

/**
 * Is this value defined and not null?
 * @private
 */
const defined = function (val) {
	return typeof val !== "undefined" && val !== null;
};

/**
 * Is this value an object?
 * @private
 */
const object = function (val) {
	if (val == undefined) {
		return false;
	}
	return val.constructor.name === "Object";
};

const _constructor = function (val) {
	try {
		Reflect.construct(String, [], val);
	} catch (e) {
		return false;
	}
	return true;
};

/**
 * Is this value a plain object?
 * @private
 */
const plainObject = function (val) {
	return Object.prototype.toString.call(val) === "[object Object]";
};

/**
 * Is this value a function?
 * @private
 */
const fn = function (val) {
	return typeof val === "function";
};

/**
 * Is this value a boolean?
 * @private
 */
const bool = function (val) {
	return typeof val === "boolean";
};

/**
 * Is this value a Buffer object?
 * @private
 */
const buffer = function (val) {
	return val instanceof Buffer;
};

/**
 * Is this value a non-empty string?
 * @private
 */
const string = function (val) {
	return typeof val === "string" && val.length > 0;
};

/**
 * Is this value a real number?
 * @private
 */
const number = function (val) {
	return typeof val === "number" && !Number.isNaN(val);
};

/**
 * Is this value an integer?
 * @private
 */
const integer = function (val) {
	return Number.isInteger(val);
};

/**
 * Is this value within an inclusive given range?
 * @private
 */
const inRange = function (val, min, max) {
	return val >= min && val <= max;
};

/**
 * Is this value within the elements of an array?
 * @private
 */
const inArray = function (val, list) {
	return list.includes(val);
};

module.exports = {
	binary: binary,
	svg: svg,
	defined: defined,
	object: object,
	plainObject: plainObject,
	fn: fn,
	bool: bool,
	buffer: buffer,
	string: string,
	number: number,
	integer: integer,
	inRange: inRange,
	inArray: inArray,
	pathToFile: pathToFile,
};
