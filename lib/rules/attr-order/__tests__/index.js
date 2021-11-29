const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | attr-order", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }
  it("Should not report errors when attributes are in the correct order", async function() {
    const linter = createLinter({ "attr-order": ["class", "src", "height", "width"] });
    const html = "<img class='test' src='test.gif' height='200' width='300'/>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should fail when attribute order is reversed", async function() {
    const linter = createLinter({ "attr-order": ["class", "src"] });
    const html = "<img src='test.gif' class='test' />";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report one error per misplaced attribute", async function() {
    const linter = createLinter({ "attr-order": ["class", "src", "height", "width"] });
    const html = "<img height='200' src='test.gif' class='test' width='300'/>";

    // should report error for src and class but not width
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Should not report error for attributes that are not present", async function() {
    const linter = createLinter({ "attr-order": ["class", "src", "height", "width"] });
    const html = "<img src='test.gif' height='200'/>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report additional errors for attributes which are not present", async function() {
    const linter = createLinter({ "attr-order": ["class", "src", "height", "width"] });
    const html = "<img src='test.gif' class='test'/>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should be case insensitive (OK)", async function() {
    const linter = createLinter({ "attr-order": ["class", "src", "HEIGHT", "width"] });
    const html = "<img CLASS='test' src='test.gif' height='200' width='300'/>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should be case insensitive (KO)", async function() {
    const linter = createLinter({ "attr-order": ["class", "src", "HEIGHT", "width"] });
    const html = "<img src='test.gif' CLASS='test' height='200' width='300'/>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should workds for attributes without value", async function() {
    const linter = createLinter({ "attr-order": ["type", "aria-label", "disabled"] });
    const html = "<input disabled type='checkbox' aria-label='A checkbox'/>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should accept Regexp as config (OK)", async function() {
    const linter = createLinter({ "attr-order": ["class", /^.*$/] });
    const html = "<img class='test' src='test.gif' height='200' width='300'/>";

    // class then everything else
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should accept Regexp as config (KO)", async function() {
    const linter = createLinter({ "attr-order": ["class", /^.*$/] });
    const html = "<img src='test.gif' class='test' height='200' width='300'/>";

    // class then everything else
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should accept multiple Regexp as config (OK)", async function() {
    const linter = createLinter({ "attr-order": ["class", /^data-.*$/, /^.*$/] });
    const html = "<img class='test' data-x src='test.gif' height='200' width='300'/>";

    // class then everything else
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should accept multiple Regexp as config (KO)", async function() {
    const linter = createLinter({ "attr-order": ["class", /^data-.*$/, /^.*$/] });
    const html = "<img data-x class='test' src='test.gif' height='200' width='300'/>";

    // class then everything else
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should throw an error when an invalid config is provided", function() {
    const linter = createLinter({ "attr-order": ["class", 3] });
    const html = "";
    expect(() => linter.lint(html))
      .to
      .throw("Configuration for rule \"attr-order\" is invalid: Expected (string|RegExp)[] got number[]");
  });

  it("Should throw an error when an invalid config is provided (string only)", function() {
    const linter = createLinter({ "attr-order": "class" });
    const html = "";
    expect(() => linter.lint(html))
      .to
      .throw("Configuration for rule \"attr-order\" is invalid: Expected (string|RegExp)[] got string");
  });
});

describe("attr-order", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report errors when attributes are in the correct order", async function() {
    const linter = createLinter({
      "attr-order": [
        true,
        ["class", "src", "height", "width"]
      ]
    });
    const html = "<img class='test' src='test.gif' height='200' width='300'/>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should fail when attribute order is reversed", async function() {
    const linter = createLinter({
      "attr-order": [
        true,
        ["class", "src"]
      ]
    });
    const html = "<img src='test.gif' class='test' />";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report one error per misplaced attribute", async function() {
    const linter = createLinter({
      "attr-order": [
        true,
        ["class", "src", "height", "width"]
      ]
    });
    const html = "<img height='200' src='test.gif' class='test' width='300'/>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Should not report error for attributes that are not present", async function() {
    const linter = createLinter({
      "attr-order": [
        true,
        ["class", "src", "height", "width"]
      ]
    });
    const html = "<img src='test.gif' height='200'/>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report additional errors for attributes which are not present", async function() {
    const linter = createLinter({
      "attr-order": [
        true,
        ["class", "src", "height", "width"]
      ]
    });
    const html = "<img src='test.gif' class='test'/>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should be case insensitive (OK)", async function() {
    const linter = createLinter({
      "attr-order": [
        true,
        ["class", "src", "HEIGHT", "width"]
      ]
    });
    const html = "<img CLASS='test' src='test.gif' height='200' width='300'/>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should be case insensitive (HTML attributes) (KO)", async function() {
    const linter = createLinter({
      "attr-order": [
        true,
        ["class", "src", "height", "width"]
      ]
    });
    const html = "<img src='test.gif' CLASS='test' height='200' width='300'/>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should be case insensitive (HTML attributes and config) (KO)", async function() {
    const linter = createLinter({
      "attr-order": [
        true,
        ["CLASS", "src", "HEIGHT", "width"]
      ]
    });
    const html = "<img src='test.gif' CLASS='test' height='200' width='300'/>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Report errors for angular like attributes (*ngIf)", async function() {
    const linter = createLinter({
      "attr-order": [
        true,
        ["*ngIf", "class"]
      ]
    });
    const html = "<div class='item' *ngIf='bar'></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Report errors for angular like attributes ([ngClass])", async function() {
    const linter = createLinter({
      "attr-order": [
        true,
        ["[ngClass]", "class"]
      ]
    });
    const html = "<div class='table' [ngClass]='foo'></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should workds for attributes without value", async function() {
    const linter = createLinter({
      "attr-order": [
        "error",
        ["type", "aria-label", "disabled"]
      ]
    });
    const html = "<input disabled type='checkbox' aria-label='A checkbox'/>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should accept Regexp as config (OK)", async function() {
    const linter = createLinter({
      "attr-order": [
        true,
        ["class", /^.*$/]
      ]
    });
    const html = "<img class='test' src='test.gif' height='200' width='300'/>";

    // class then everything else
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should accept Regexp as config (KO)", async function() {
    const linter = createLinter({
      "attr-order": [
        true,
        ["class", /^.*$/]
      ]
    });
    const html = "<img src='test.gif' class='test' height='200' width='300'/>";

    // class then everything else
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should accept multiple Regexp as config (OK)", async function() {
    const linter = createLinter({
      "attr-order": [
        true,
        ["class", /^data-.*$/, /^.*$/]
      ]
    });
    const html = "<img class='test' data-x src='test.gif' height='200' width='300'/>";

    // class then everything else
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should accept multiple Regexp as config (KO)", async function() {
    const linter = createLinter({
      "attr-order": [
        true,
        ["class", /^data-.*$/, /^.*$/]
      ]
    });
    const html = "<img data-x class='test' src='test.gif' height='200' width='300'/>";

    // class then everything else
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should throw an error when an invalid config is provided", function() {
    const config = {
      "attr-order": [
        true,
        ["class", 3]
      ]
    };
    expect(() => createLinter(config))
      .to
      .throw("Configuration for rule \"attr-order\" is invalid: Expected (string|RegExp)[] got number[]");
  });

  it("Should throw an error when an invalid config is provided (string only)", function() {
    const config = {
      "attr-order": [
        true,
        "class"
      ]
    };
    expect(() => createLinter(config))
      .to
      .throw("Configuration for rule \"attr-order\" is invalid: Expected (string|RegExp)[] got string");
  });
});
