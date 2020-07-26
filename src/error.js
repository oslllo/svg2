"use strict";

/**
 * Create an Error with a message relating to an invalid parameter.
 *
 * @param {string} name - parameter name.
 * @param {string} expected - description of the type/value/range expected.
 * @param {*} actual - the value received.
 * @returns {Error} Containing the formatted message.
 * @private
 */
 const invalidParameterError = function (name, expected, actual) {
	return new TypeError(
		`Expected <${expected}> for [${name}] but received ${actual} of type <${typeof actual}>`
	);
};

module.exports = {
	invalidParameterError: invalidParameterError,
};
