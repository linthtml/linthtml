const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | doctype-html5", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }
  it("Should not report any error for a valid html5 DOCTYPE", async function() {
    const linter = createLinter({ "doctype-html5": true });
    const html = `
      <!DOCTYPE html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when DOCTYPE is not for html5", async function() {
    const linter = createLinter({ "doctype-html5": true });
    const html = `
      <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"\n"http://www.w3.org/TR/html4/strict.dtd">
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error given a legacy doctype", async function() {
    const linter = createLinter({ "doctype-html5": true });
    const html = `
      <!DOCTYPE html SYSTEM "about:legacy-compat">
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report an error if there's no doctype", async function() {
    const linter = createLinter({ "doctype-html5": true });
    const html = `
      <!random g">
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});
describe("doctype-html5", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report any error for a valid html5 DOCTYPE", async function() {
    const linter = createLinter({ "doctype-html5": true });
    const html = `
      <!DOCTYPE html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when DOCTYPE is not for html5", async function() {
    const linter = createLinter({ "doctype-html5": true });
    const html = `
      <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"\n"http://www.w3.org/TR/html4/strict.dtd">
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error given a legacy doctype", async function() {
    const linter = createLinter({ "doctype-html5": true });
    const html = `
      <!DOCTYPE html SYSTEM "about:legacy-compat">
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report an error if there's not doctype", async function() {
    const linter = createLinter({ "doctype-html5": true });
    const html = `
      <!random g">
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});
