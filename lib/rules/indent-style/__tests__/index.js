const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
// describe("indent-style", function() {
//   describe(`"tabs" style`, function() {
//     it("Should not report any error for tab indent", function(done) {
//       const linter = createLinter();
//       const html = `<div>\n\t<p>foo</p>\n</div>`;
      
//       linter.lint(html, none, { "indent-style": "tabs" }).then((issues) => {
//         expect(issues).to.have.lengthOf(0);
//         done();
//       }); 
//     });

//     it("Should report an error for space indent", function(done) {
//       const linter = createLinter();
//       const html = `<div>\n <p>foo</p>\n</div>`;
      
//       linter.lint(html, none, { "indent-style": "tabs" }).then((issues) => {
//         expect(issues).to.have.lengthOf(1);
//         done();
//       }); 
//     });
//   });

//   describe(`"spaces" style`, function() {
//     it("Should not report any error for space indent", function(done) {
//       const linter = createLinter();
//       const html = `<div>\n <p>foo</p>\n</div>`;
      
//       linter.lint(html, none, { "indent-style": "spaces" }).then((issues) => {
//         expect(issues).to.have.lengthOf(0);
//         done();
//       }); 
//     });

//     it("Should report an error for tab indent", function(done) {
//       const linter = createLinter();
//       const html = `<div>\n\t<p>foo</p>\n</div>`;
      
//       linter.lint(html, none, { "indent-style": "spaces" }).then((issues) => {
//         expect(issues).to.have.lengthOf(1);
//         done();
//       }); 
//     });
//   });

//   describe(`"nonmixed" style`, function() {
//     it("Should not report any error for space indent", function(done) {
//       const linter = createLinter();
//       const html = `<div>\n <p>foo</p>\n</div>`;
      
//       linter.lint(html, none, { "indent-style": "nonmixed" }).then((issues) => {
//         expect(issues).to.have.lengthOf(0);
//         done();
//       }); 
//     });

//     it("Should not report any error for tab indent", function(done) {
//       const linter = createLinter();
//       const html = `<div>\n\t<p>foo</p>\n</div>`;
      
//       linter.lint(html, none, { "indent-style": "nonmixed" }).then((issues) => {
//         expect(issues).to.have.lengthOf(0);
//         done();
//       }); 
//     });

//     it("Should report an error when tabs and spaces are mixed on the ssame line", function(done) {
//       const linter = createLinter();
//       const html = `<div>\n\t <p>foo</p>\n</div>`;
      
//       linter.lint(html, none, { "indent-style": "nonmixed" }).then((issues) => {
//         expect(issues).to.have.lengthOf(1);
//         done();
//       }); 
//     });
//   });
// });


// describe(`"ident-style" + "indent-width"`, function() {
//   describe(`"tabs" style`, function() {

//     it("Should not report any error when the correct number of tabs is used", function(done) {
      // const linter = createLinter();
      // const html = `<div>\n\t<p>foo</p>\n</div>`;
      
      // linter.lint(html, none, { "indent-style": "tabs", "indent-width": 1 }).then((issues) => {
      //   expect(issues).to.have.lengthOf(0);
      //   done();
      // }); 
//     });

//     it("Should report an error for space indent", function(done) {
      const linter = createLinter();
      const html = `<div>\n\t\t<p>foo</p>\n<p>bar</p>\n</div>`;
      
      linter.lint(html, none, { "indent-style": "tabs", "indent-width": 1 }).then((issues) => {
        console.log(issues)
        expect(issues).to.have.lengthOf(1);
        done();
      }); 
//     });
//   });

//   describe(`"spaces" style`, function() {
//     it("Should not report any error for space indent", function(done) {
//       const linter = createLinter();
//       const html = `<div>\n <p>foo</p>\n</div>`;
      
//       linter.lint(html, none, { "indent-style": "spaces" }).then((issues) => {
//         expect(issues).to.have.lengthOf(0);
//         done();
//       }); 
//     });

//     it("Should report an error for tab indent", function(done) {
//       const linter = createLinter();
//       const html = `<div>\n\t<p>foo</p>\n</div>`;
      
//       linter.lint(html, none, { "indent-style": "spaces" }).then((issues) => {
//         expect(issues).to.have.lengthOf(1);
//         done();
//       }); 
//     });
//   });

//   describe(`"nonmixed" style`, function() {
//     it("Should not report any error for space indent", function(done) {
//       const linter = createLinter();
//       const html = `<div>\n <p>foo</p>\n</div>`;
      
//       linter.lint(html, none, { "indent-style": "nonmixed" }).then((issues) => {
//         expect(issues).to.have.lengthOf(0);
//         done();
//       }); 
//     });

//     it("Should not report any error for tab indent", function(done) {
//       const linter = createLinter();
//       const html = `<div>\n\t<p>foo</p>\n</div>`;
      
//       linter.lint(html, none, { "indent-style": "nonmixed" }).then((issues) => {
//         expect(issues).to.have.lengthOf(0);
//         done();
//       }); 
//     });

//     it("Should report an error when tabs and spaces are mixed on the ssame line", function(done) {
//       const linter = createLinter();
//       const html = `<div>\n\t <p>foo</p>\n</div>`;
      
//       linter.lint(html, none, { "indent-style": "nonmixed" }).then((issues) => {
//         expect(issues).to.have.lengthOf(1);
//         done();
//       }); 
//     });
//   });
// });

// name: "indent-width",
// desc: [
//   "The value of this option is either `false` or a positive integer. If it",
//   "is a number and spaces are used for indentation, then spaces used to",
//   "indent must come in multiples of that number."
// ].join("\n"),
// process(option) {
//   if (typeof option !== "number") {
//     throw new Error(`Configuration for rule "${this.name}" is invalid: Expected number got ${typeof format}`);
//   }
//   if (option < 0) {
//     throw new Error(`Configuration for rule "${this.name}" is invalid: Only positive indent value are allowed.`);
//   }
//   return option;
// }

// },
// {
// name: "indent-width-cont",
// desc: [
//   "If set, ignore `indent-width` for lines whose first non-whitespace",
//   "character is not `<`. This is known as continuation indent because it",
//   "enables the user to continue tags onto multiple lines while aligning the",
//   "attribute names."
// ].join("\n"),
// process: proc.bool
// },
// {
// name: "indent-delta",

// module.exports = [
//   {
//     desc: "should work with tabs",
//     input: ["<body>", "\t<p>hello</p>", "</body>"].join("\n"),
//     opts: { "indent-delta": true },
//     output: 0
//   },
//   {
//     desc: "should detect bad tab indent",
//     input: [
//       "<body>",
//       "\t\t\t<p>hello</p>",
//       "\t\t\t<p>hello</p>",
//       "</body>"
//     ].join("\n"),
//     opts: { "indent-delta": true },
//     output: 2
//   },
//   {
//     desc: "should work with tabs and spaces",
//     input: ["<body>", "\t<p>hello</p>", "  <p>hello</p>", "</body>"].join("\n"),
//     opts: { "indent-delta": true, "indent-width": 2 },
//     output: 0
//   },
//   {
//     desc: "should tab to next multiple of indent-width",
//     input: [
//       "<body>",
//       "\t<p>hello</p>", // 1 tab
//       "   \t   \t<p>hello</p>", // 2 tabs
//       "    <p>hello</p>", // 1 tab
//       "</body>"
//     ].join("\n"),
//     opts: { "indent-delta": true, "indent-width": 4 },
//     output: 1 // From indent-width; none from indent-delta
//   },
//   {
//     desc: "should ignore empty lines",
//     input: [
//       "<body>",
//       "\t<p>break with</p>",
//       "\t\t<p>empty line</p>",
//       "",
//       "\t<p>is fine</p>",
//       "</body>"
//     ].join("\r\n"),
//     opts: { "indent-delta": true, "indent-width": 6 },
//     output: 0
//   },
//   {
//     desc: "should detect bad indent with tabs and spaces",
//     input: [
//       "<body>",
//       "\t  <p>hello</p>",
//       "  <p>hello</p>",
//       "\t\t\t<p>hello</p>",
//       "    <p>hello</p>",
//       "</body>"
//     ].join("\n"),
//     opts: { "indent-delta": true, "indent-width": 2 },
//     output: 3
//   },
//   {
//     desc: "should take into account indent-width-cont option",
//     input: [
//       '<div myFirstAttr="a">',
//       '     mySecondAttr="b">',
//       "  <p>hello</p>",
//       "</div>"
//     ].join("\n"),
//     opts: {
//       "indent-delta": true,
//       "indent-width": 2,
//       "indent-width-cont": true
//     },
//     output: 0
//   }
// ];
