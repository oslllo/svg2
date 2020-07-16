"use strict";

const fs = require("fs");

module.exports = {
	isSvg: function (input) {
		const htmlCommentRegex = /<!--([\s\S]*?)-->/g;
		const isBinary = (buffer) => {
			const isBuffer = Buffer.isBuffer(buffer);

			for (let i = 0; i < 24; i++) {
				const characterCode = isBuffer ? buffer[i] : buffer.charCodeAt(i);

				if (characterCode === 65533 || characterCode <= 8) {
					return true;
				}
			}

			return false;
		};
		const cleanEntities = (svg) => {
			const entityRegex = /\s*<!Entity\s+\S*\s*(?:"|')[^"]+(?:"|')\s*>/gim;
			// Remove entities
			return svg.replace(entityRegex, "");
		};
		const regex = /^\s*(?:<\?xml[^>]*>\s*)?(?:<!doctype svg[^>]*\s*(?:\[?(?:\s*<![^>]*>\s*)*\]?)*[^>]*>\s*)?(?:<svg[^>]*>[^]*<\/svg>|<svg[^/>]*\/\s*>)\s*$/i;

		return (
			Boolean(input) &&
			!isBinary(input) &&
			regex.test(cleanEntities(input.toString()).replace(htmlCommentRegex, ""))
		);
	},
	isBuffer: function (input) {
		return Buffer.isBuffer(input);
	},
	isFilePath: function (input) {
		return fs.existsSync(input) && fs.lstatSync(input).isFile();
	}
};
