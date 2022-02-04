import { expect } from "chai";
import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | button-req-content", function () {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should report an error when button has no text", async function () {
    const linter = createLinter({ "button-req-content": true });
    const html = "<button></button>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
  it("Should report an error when button has only whitespaces has content", async function () {
    const linter = createLinter({ "button-req-content": true });
    const html = "<button>       </button>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
  it("Should report an error when button has no text (deep nesting)", async function () {
    const linter = createLinter({ "button-req-content": true });
    const html = "<button><span><span><span></span><strong></strong></span></span></button>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
  it("Should not report an error when button has text", async function () {
    const linter = createLinter({ "button-req-content": true });
    const html = "<button>foo</button>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
  it("Should not report an error when button has text and an html comment", async function () {
    const linter = createLinter({ "button-req-content": true });
    const html = "<button><!-- comment -->foo</button>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
  it("Should not report an error when button has text content (deep nesting)", async function () {
    const linter = createLinter({ "button-req-content": true });
    const html = "<button><span><span><span>foo</span></span></span></button>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
  it("Should not report an error when button has text content (multiple text deep nesting)", async function () {
    const linter = createLinter({ "button-req-content": true });
    const html = "<button><span><span><span>foo</span><strong>bar</strong></span></span></button>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
  it("Should report an error when button has an aria-label with no content", async function () {
    const linter = createLinter({ "button-req-content": true });
    const html = '<button aria-label=""></button>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report an error when button has an aria-label with content", async function () {
    const linter = createLinter({ "button-req-content": true });
    const html = '<button aria-label="button"></button>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});

describe("button-req-content", function () {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should report an error when button has no text", async function () {
    const linter = createLinter({
      "button-req-content": true
    });
    const html = "<button></button>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
  it("Should report an error when button has only whitespaces has content", async function () {
    const linter = createLinter({
      "button-req-content": true
    });
    const html = "<button>       </button>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
  it("Should report an error when button has no text (deep nesting)", async function () {
    const linter = createLinter({
      "button-req-content": true
    });
    const html = "<button><span><span><span></span><strong></strong></span></span></button>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
  it("Should not report an error when button has text", async function () {
    const linter = createLinter({
      "button-req-content": true
    });
    const html = "<button>foo</button>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
  it("Should not report an error when button has text and an html comment", async function () {
    const linter = createLinter({
      "button-req-content": true
    });
    const html = "<button><!-- comment -->foo</button>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
  it("Should not report an error when button has text content (deep nesting)", async function () {
    const linter = createLinter({
      "button-req-content": true
    });
    const html = "<button><span><span><span>foo</span></span></span></button>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
  it("Should not report an error when button has text content (multiple text deep nesting)", async function () {
    const linter = createLinter({
      "button-req-content": true
    });
    const html = "<button><span><span><span>foo</span><strong>bar</strong></span></span></button>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
  it("Should report an error when button has an aria-label with no content", async function () {
    const linter = createLinter({
      "button-req-content": true
    });
    const html = "<button aria-label=''></button>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report an error when button has an aria-label with content", async function () {
    const linter = createLinter({
      "button-req-content": true
    });
    const html = '<button aria-label="button"></button>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});
