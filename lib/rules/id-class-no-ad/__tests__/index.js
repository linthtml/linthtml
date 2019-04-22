const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("id-class-no-ad", function() {

  describe(`"ad" word`, function() {

    it(`Should not report any error for "class" attributes not containing "ad"`, function(done) {
      const linter = createLinter();
      const html = `<div class="foo">Foo</div>`;
      
      linter.lint(html, none, { "id-class-no-ad": true }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      }); 
    });
    it(`Should not report any error for "id" attributes not containing "ad"`, function(done) {
      const linter = createLinter();
      const html = `<div id="foo">Foo</div>`;
      
      linter.lint(html, none, { "id-class-no-ad": true }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      }); 
    });
    
    it(`Should report an error for "class" attributes containing "ad"`, function(done) {
      const linter = createLinter();
      const html = `
      <div class="ad">Foo</div>
      <div class="my_ad_class">Foo</div>
      `;
      
      linter.lint(html, none, { "id-class-no-ad": true }).then((issues) => {
        expect(issues).to.have.lengthOf(2);
        done();
      }); 
    });
    it(`Should report an error for "id" attributes containing "ad"`, function(done) {
      const linter = createLinter();
      const html = `
      <div id="ad">Foo</div>
      <div id="my_ad_id">Foo</div>
      `;
      
      linter.lint(html, none, { "id-class-no-ad": true }).then((issues) => {
        expect(issues).to.have.lengthOf(2);
        done();
      }); 
    });
  });

  describe(`"ad" word`, function() {

    it(`Should not report any error for "class" attributes not containing "ad"`, function(done) {
      const linter = createLinter();
      const html = `<div class="foo">Foo</div>`;
      
      linter.lint(html, none, { "id-class-no-ad": true }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      }); 
    });
    it(`Should not report any error for "id" attributes not containing "ad"`, function(done) {
      const linter = createLinter();
      const html = `<div id="foo">Foo</div>`;
      
      linter.lint(html, none, { "id-class-no-ad": true }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      }); 
    });
    
    it(`Should report an error for "class" attributes containing "ad"`, function(done) {
      const linter = createLinter();
      const html = `
      <div class="ad">Foo</div>
      <div class="my_ad_class">Foo</div>
      `;
      
      linter.lint(html, none, { "id-class-no-ad": true }).then((issues) => {
        expect(issues).to.have.lengthOf(2);
        done();
      }); 
    });
    it(`Should report an error for "id" attributes containing "ad"`, function(done) {
      const linter = createLinter();
      const html = `
      <div id="ad">Foo</div>
      <div id="my_ad_id">Foo</div>
      `;
      
      linter.lint(html, none, { "id-class-no-ad": true }).then((issues) => {
        expect(issues).to.have.lengthOf(2);
        done();
      }); 
    });
    
    it(`Should not report any error for adjacent world`, function(done) {
      const linter = createLinter();
      const html = `
        <div class="adjacent">Foo</div>
      `;
      
      linter.lint(html, none, { "id-class-no-ad": true }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      }); 
    });
  });

  describe(`"social" word`, function() {

    it(`Should not report any error for "class" attributes not containing "social"`, function(done) {
      const linter = createLinter();
      const html = `<div class="foo">Foo</div>`;
      
      linter.lint(html, none, { "id-class-no-ad": true }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      }); 
    });
    it(`Should not report any error for "id" attributes not containing "social"`, function(done) {
      const linter = createLinter();
      const html = `<div id="foo">Foo</div>`;
      
      linter.lint(html, none, { "id-class-no-ad": true }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      }); 
    });
    
    it(`Should report an error for "class" attributes containing "social"`, function(done) {
      const linter = createLinter();
      const html = `
      <div class="social">Foo</div>
      <div class="my_social_class">Foo</div>
      `;
      
      linter.lint(html, none, { "id-class-no-ad": true }).then((issues) => {
        expect(issues).to.have.lengthOf(2);
        done();
      }); 
    });

    it(`Should report an error for "id" attributes containing "social"`, function(done) {
      const linter = createLinter();
      const html = `
      <div id="ad">Foo</div>
      <div id="my_social_id">Foo</div>
      `;
      
      linter.lint(html, none, { "id-class-no-ad": true }).then((issues) => {
        expect(issues).to.have.lengthOf(2);
        done();
      }); 
    });
    
    it(`Should not report any error for adjacent world`, function(done) {
      const linter = createLinter();
      const html = `
        <div class="socialize">Foo</div>
      `;
      
      linter.lint(html, none, { "id-class-no-ad": true }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      }); 
    });
  });

  describe(`"banner" word`, function() {

    it(`Should not report any error for "class" attributes not containing "banner"`, function(done) {
      const linter = createLinter();
      const html = `<div class="foo">Foo</div>`;
      
      linter.lint(html, none, { "id-class-no-ad": true }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      }); 
    });
    it(`Should not report any error for "id" attributes not containing "banner"`, function(done) {
      const linter = createLinter();
      const html = `<div id="foo">Foo</div>`;
      
      linter.lint(html, none, { "id-class-no-ad": true }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      }); 
    });
    
    it(`Should report an error for "class" attributes containing "banner"`, function(done) {
      const linter = createLinter();
      const html = `
      <div class="banner">Foo</div>
      <div class="my_banner_class">Foo</div>
      `;
      
      linter.lint(html, none, { "id-class-no-ad": true }).then((issues) => {
        expect(issues).to.have.lengthOf(2);
        done();
      }); 
    });
    it(`Should report an error for "id" attributes containing "banner"`, function(done) {
      const linter = createLinter();
      const html = `
      <div id="ad">Foo</div>
      <div id="my_banner_id">Foo</div>
      `;
      
      linter.lint(html, none, { "id-class-no-ad": true }).then((issues) => {
        expect(issues).to.have.lengthOf(2);
        done();
      }); 
    });
  });
    
  it(`Should not report any error for adjacent world`, function(done) {
    const linter = createLinter();
    const html = `
      <div class="bannerman">Foo</div>
    `;
    
    linter.lint(html, none, { "id-class-no-ad": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });
});
