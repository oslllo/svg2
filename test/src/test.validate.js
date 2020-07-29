"use strict";

// validate.js
// describe("validate.js", () => {
// 	describe("isSvg()", () => {
// 		var isSvg = validate.svg;
// 		it("can identify valid SVGs", () => {
// 			// assert.isTrue(isSvg(fs.readFileSync('fixtures/fixture.svg')));
// 			assert.isTrue(
// 				isSvg(
// 					'<svg width="100" height="100" viewBox="0 0 30 30" version="1.1"></svg>'
// 				)
// 			);
// 			assert.isTrue(
// 				isSvg(
// 					'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg></svg>'
// 				)
// 			);
// 			assert.isTrue(
// 				isSvg(
// 					'<?xml version="1.0" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg></svg>'
// 				)
// 			);
// 			assert.isTrue(
// 				isSvg(
// 					'<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" [<!ENTITY ns_flows "http://ns.adobe.com/Flows/1.0/">]><svg></svg>'
// 				)
// 			);
// 			assert.isTrue(
// 				isSvg(
// 					'<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" [ <!ENTITY ns_flows "http://ns.adobe.com/Flows/1.0/"> <!ENTITY ns_custom "http://ns.adobe.com/GenericCustomNamespace/1.0/"> ]><svg></svg>'
// 				)
// 			);
// 			assert.isTrue(isSvg("<svg></svg>    "));
// 			assert.isTrue(isSvg("    <svg></svg>"));
// 			assert.isTrue(isSvg("<svg>\n</svg>"));
// 			assert.isTrue(isSvg("<!--unicorn--><svg>\n</svg><!--cake-->"));
// 			assert.isTrue(isSvg("<svg/>"));
// 			assert.isTrue(
// 				isSvg(`
//         <!-- Generator: Some Graphic Design Software  -->
//         <svg version="1.1">
//         </svg>
//         `)
// 			);
// 		});
// 		it("can identify invalid SVGs", () => {
// 			// assert.isFalse(isSvg(fs.readFileSync('fixtures/fixture.jpg')));
// 			assert.isFalse(isSvg("this is not svg, but it mentions <svg> tags"));
// 			assert.isFalse(isSvg("<svg> hello I am an svg oops maybe not"));
// 			assert.isFalse(isSvg("<svg></svg> this string starts with an svg"));
// 			assert.isFalse(isSvg("this string ends with an svg <svg></svg>"));
// 			assert.isFalse(isSvg("<div><svg></svg>"));
// 			assert.isFalse(isSvg("<div><svg></svg></div>"));
// 			assert.isFalse(
// 				isSvg("this string contains an svg <svg></svg> in the middle")
// 			);
// 			assert.isFalse(isSvg(fs.readFileSync("README.md")));
// 			assert.isFalse(isSvg(fs.readFileSync("src/index.js")));
// 			assert.isFalse(isSvg());
// 		});

// 		it("supports non-english characters", () => {
// 			assert.isTrue(
// 				isSvg(`<svg xmlns="http://www.w3.org/2000/svg"
//                  width="100%" height="100%" viewBox="0 0 400 400"
//                  direction="rtl" xml:lang="fa">
//               <title direction="ltr" xml:lang="en">Right-to-left Text</title>
//               <desc direction="ltr" xml:lang="en">
//                 A simple example for using the 'direction' property in documents
//                 that predominantly use right-to-left languages.
//               </desc>
//               <text x="200" y="200" font-size="20">داستان SVG 1.1 SE طولا ني است.</text>
//             </svg>`)
// 			);
// 		});
// 		it("supports markup inside Entity tags", () => {
// 			assert.isTrue(
// 				isSvg(
// 					"<?xml version=\"1.0\" encoding=\"utf-8\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\" [ <!ENTITY Smile \" <rect x='.5' y='.5' width='29' height='39' fill='black' stroke='red'/> <g transform='translate(0, 5)'> <circle cx='15' cy='15' r='10' fill='yellow'/><circle cx='12' cy='12' r='1.5' fill='black'/><circle cx='17' cy='12' r='1.5' fill='black'/><path d='M 10 19 L 15 23 20 19' stroke='black' stroke-width='2'/></g>\"> ]><svg width=\"850px\" height=\"700px\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><g transform=\"matrix(16,0,0,16,0,0)\">&Smile;</g></svg>"
// 				)
// 			);
// 			assert.isTrue(
// 				isSvg(
// 					"<?xml version=\"1.0\" encoding=\"utf-8\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\" [ <!ENTITY Smile \" <rect x='.5' y='.5' width='29' height='39' fill='black' stroke='red'/> <g transform='translate(0, 5)'> <circle cx='15' cy='15' r='10' fill='yellow'/><circle cx='12' cy='12' r='1.5' fill='black'/><circle cx='17' cy='12' r='1.5' fill='black'/><path d='M 10 19 L 15 23 20 19' stroke='black' stroke-width='2'/></g>\"> <!ENTITY ns_flows \"http://ns.adobe.com/Flows/1.0/\">]><svg width=\"850px\" height=\"700px\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><g transform=\"matrix(16,0,0,16,0,0)\">&Smile;</g></svg>"
// 				)
// 			);
// 			assert.isTrue(
// 				isSvg(`
//             <?xml version="1.0" encoding="utf-8"?>
//                 <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" [
//                     <!ENTITY Orange "<g transform='translate(0, 5)'><circle cx='12' cy='12' r='1.5' fill='orange'/><path d='M 10 19 L 15 23 20 19' stroke='orange' stroke-width='2'/></g>">
//                     <!ENTITY Melon "<g transform='translate(10, 10)'><circle cx='12' cy='12' r='1.5' fill='yellow'/><path d='M 10 19 L 15 23 20 19' stroke='yellow' stroke-width='2'/></g>">
//                 ]>
//             <svg width="850px" height="700px" version="1.1"
//                 xmlns="http://www.w3.org/2000/svg">
//                 <g transform="matrix(16,0,0,16,0,0)">
//                      &Melon;
//                  </g>
//                  <g transform="matrix(32,0,0,32,0,0)">
//                      &Orange;
//                  </g>
//             </svg>`)
// 			);
// 		});
// 	});
// });