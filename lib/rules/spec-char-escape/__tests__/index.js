const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("spec-char-escape", function() {

  it(`Should report an error for special characters in text elements`, function(done) {
    const linter = createLinter();
    const html = `<p>Hello & hello</p>`;
    
    linter.lint(html, none, { "spec-char-escape": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it(`Should report an error for special characters in attributes value`, function(done) {
    const linter = createLinter();
    const html = `<p class="yours&mine">Foo</p>`;
    
    linter.lint(html, none, { "spec-char-escape": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });
  
  // \& not working cause in js \& became \
  // /* eslint-disable no-useless-escape */
  // it(`Should not report any error for special characters in text elements`, function(done) {
  //   const linter = createLinter();
  //   const html = "<p>Hello \& hello</p>";
    
  //   linter.lint(html, none, { "spec-char-escape": true }).then((issues) => {
  //     expect(issues).to.have.lengthOf(0);
  //     done();
  //   }); 
  // });
  
  // it(`Should not report any error for special characters in attributes value`, function(done) {
  //   const linter = createLinter();
  //   const html = "<p class='yours\&mine'>Foo</p>";
    
  //   linter.lint(html, none, { "spec-char-escape": true }).then((issues) => {
  //     expect(issues).to.have.lengthOf(0);
  //     done();
  //   }); 
  // });
  //   /* eslint-enable no-useless-escape */

});

// module.exports = [

//   {
//     desc: "should ignore text matching text-ignore-regex",
//     input:
//       '<div><p id="abc{{angu|ar $#!+}}">Some\n{{>>angular&!!\\}}\n{{!!!!}}\ntext</p></div>',
//     opts: { "spec-char-escape": true, "text-ignore-regex": /{{.*?}}/ },
//     output: 0
//   },
//   {
//     desc: "should check sections of text not matching text-ignore-regex",
//     input:
//       '<div><p id="abc{{angu|ar $#!+}}">Some&\n{{>>angular&!!\\}}\n>text</p></div>',
//     opts: { "spec-char-escape": true, "text-ignore-regex": /{{.*?}}/ },
//     output: 2
//   },
//   {
//     desc: "text-ignore-regex should maintain case-insensitive flag",
//     input: "AA&Bb aa&bb",
//     opts: { "spec-char-escape": true, "text-ignore-regex": /aa.*?bb/i },
//     output: 0
//   }
// ];
