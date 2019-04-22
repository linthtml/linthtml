const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("head-valid-content-model", function() {

  it("Should report an error for every invalid child", function(done) {
    const linter = createLinter();
    const html = `
    <html>
      <head>
        <div>a div</div>
        <p>a paragraph</p>
      </head>
    </html>
    `;
    
    linter.lint(html, none, { "head-valid-content-model": true }).then((issues) => {
      expect(issues).to.have.lengthOf(2);
      done();
    }); 
  });

  it("Should not report any error when <head> is not present", function(done) {
    const linter = createLinter();
    const html = `
    <html>
      <body></body>
    </html>
    `;
    
    linter.lint(html, none, { "head-valid-content-model": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should not report any error for valid child element", function(done) {
    const linter = createLinter();
    const html = `
    <html>
      <head>
        <title></title>
        <link></link>
        <script></script>
        <style></style>
        <template></template>
        <noscript></noscript>
        <meta></meta>
      </head>
    </html>
    `;
    
    linter.lint(html, none, { "head-valid-content-model": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });
  it("Should not report any error for empty <head> element", function(done) {
    const linter = createLinter();
    const html = `
    <html>
      <head>
      </head>
    </html>
    `;
    
    linter.lint(html, none, { "head-valid-content-model": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });
});
