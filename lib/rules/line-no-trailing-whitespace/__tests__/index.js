const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("line-no-trailling-whitespace", function() {

  it("Should report an error when the line end with a trailling whitespace", function(done) {
    const linter = createLinter();
    const html = `1234 `;
    
    linter.lint(html, none, { "line-no-trailing-whitespace": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it("Should report an error per line with a trailling whitespace", function(done) {
    const linter = createLinter();
    const html = `
    foo 
    bar `;
    
    linter.lint(html, none, { "line-no-trailing-whitespace": true }).then((issues) => {
      expect(issues).to.have.lengthOf(2);
      done();
    }); 
  });

  it("Should report only on error when line end with multiples trailling whitespace", function(done) {
    const linter = createLinter();
    const html = `foo   `;
    
    linter.lint(html, none, { "line-no-trailing-whitespace": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

});

// module.exports = [
//   {
//     desc: "should match unicode spaces",
//     input: "s p a c e\u00a0\r a n d\u2007\rl i n e\u205f",
//     opts: { "line-no-trailing-whitespace": true },
//     output: 3
//   },
//   {
//     desc: "should not match empty lines with CRLF",
//     input: ["<div>", "", "</div>"].join("\r\n") + "\r\n",
//     opts: { "line-no-trailing-whitespace": true },
//     output: 0
//   }
// ];
