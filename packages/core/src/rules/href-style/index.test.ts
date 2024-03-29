import { expect } from "chai";
import linthtml from "../../index.js";
import { presets } from "../../presets/index.js";
import type { LegacyLinterConfig, RuleConfig } from "../../read-config.js";

describe("legacy linter | href-style", function () {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  describe('"absolute" mode', function () {
    it("Should not report any error for absolute links", async function () {
      const linter = createLinter({ "href-style": "absolute" });
      const html = '<a href="http://www.google.com">A link</a>';

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for relative links", async function () {
      const linter = createLinter({ "href-style": "absolute" });
      const html = '<a href="/foo">A link</a>';

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });

    it("Should not report any error for empty links", async function () {
      const linter = createLinter({ "href-style": "absolute" });
      const html = "<a>A link</a>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should not report any error for fragment only links", async function () {
      const linter = createLinter({ "href-style": "absolute" });
      const html = '<a href="#bar">A link</a>';

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });
  });
  describe('"relative" mode', function () {
    it("Should not report any error for relative links", async function () {
      const linter = createLinter({ "href-style": "relative" });
      const html = '<a href="/foo">A link</a>';

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for absolute links", async function () {
      const linter = createLinter({ "href-style": "relative" });
      const html = '<a href="http://www.google.com">A link</a>';

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });

    it("Should not report any error for empty links", async function () {
      const linter = createLinter({ "href-style": "relative" });
      const html = "<a>A link</a>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should not report any error for fragment only links", async function () {
      const linter = createLinter({ "href-style": "relative" });
      const html = '<a href="#bar">A link</a>';

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });
  });

  it("Should throw an error for an invalid config", function () {
    const linter = createLinter({ "href-style": true });
    const html = "";
    expect(() => linter.lint(html)).to.throw(
      'Configuration for rule "href-style" is invalid: Expected string got boolean'
    );
  });

  it("Should throw an error if not given a list of strings as config", function () {
    const linter = createLinter({ "href-style": "foo" });
    const html = "";
    expect(() => linter.lint(html)).to.throw(
      'Configuration for rule "href-style" is invalid: "foo" is not accepted. Accepted values are "absolute" and "relative".'
    );
  });
});
describe("href-style", function () {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  describe('"absolute" mode', function () {
    it("Should not report any error for absolute links", async function () {
      const linter = createLinter({
        "href-style": [true, "absolute"]
      });
      const html = '<a href="http://www.google.com">A link</a>';

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for relative links", async function () {
      const linter = createLinter({
        "href-style": [true, "absolute"]
      });
      const html = '<a href="/foo">A link</a>';

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });

    it("Should not report any error for empty links", async function () {
      const linter = createLinter({
        "href-style": [true, "absolute"]
      });
      const html = "<a>A link</a>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should not report any error for fragment only links", async function () {
      const linter = createLinter({
        "href-style": [true, "absolute"]
      });
      const html = '<a href="#bar">A link</a>';

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });
  });
  describe('"relative" mode', function () {
    it("Should not report any error for relative links", async function () {
      const linter = createLinter({
        "href-style": [true, "relative"]
      });
      const html = '<a href="/foo">A link</a>';

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for absolute links", async function () {
      const linter = createLinter({
        "href-style": [true, "relative"]
      });
      const html = '<a href="http://www.google.com">A link</a>';

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });

    it("Should not report any error for empty links", async function () {
      const linter = createLinter({
        "href-style": [true, "relative"]
      });
      const html = "<a>A link</a>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should not report any error for fragment only links", async function () {
      const linter = createLinter({
        "href-style": [true, "relative"]
      });
      const html = '<a href="#bar">A link</a>';

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });
  });

  it("Should throw an error for an invalid config", function () {
    const config = {
      "href-style": [true, true] as [boolean, unknown]
    };
    expect(() => createLinter(config)).to.throw(
      'Configuration for rule "href-style" is invalid: Expected string got boolean'
    );
  });

  it("Should throw an error if not given a list of strings as config", function () {
    const config = {
      "href-style": [true, "foo"] as [boolean, unknown]
    };
    expect(() => createLinter(config)).to.throw(
      'Configuration for rule "href-style" is invalid: "foo" is not accepted. Accepted values are "absolute" and "relative".'
    );
  });
});
