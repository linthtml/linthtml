const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("tag-name-lowercase", function() {

  it("Should report an error when tags name are not lowercased", function(done) {
    const linter = createLinter();
    const html = `<boDY></boDY>`;
    
    linter.lint(html, none, { "tag-name-lowercase": true  }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it("Should report an error pers tags not lowercased", function(done) {
    const linter = createLinter();
    const html = `<boDY><seCtion></section></boDY>`;
    
    linter.lint(html, none, { "tag-name-lowercase": true  }).then((issues) => {
      expect(issues).to.have.lengthOf(2);
      done();
    }); 
  });

  it("Should not report an error when tags name are lowercased", function(done) {
    const linter = createLinter();
    const html = `<body></body>`;
    
    linter.lint(html, none, { "tag-name-lowercase": true  }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should ignore directive", function(done) {
    const linter = createLinter();
    const html = `<!DOCTYPE html>`;
    
    linter.lint(html, none, { "tag-name-lowercase": true  }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });
});
