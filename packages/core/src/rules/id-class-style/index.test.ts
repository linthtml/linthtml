import { expect } from "chai";
import linthtml from "../../index.js";
import { presets } from "../../presets/index.js";
import type { LegacyLinterConfig, RuleConfig } from "../../read-config.js";

describe("legacy linter | id-style", function () {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }

  it("Should report a deprecation warning", async function () {
    const linter = createLinter({ "id-class-style": "lowercase" });
    const html = "<div></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
    expect(issues[0].severity).to.equal("warning");
    expect(issues[0].code).to.equal("DEPRECATED_RULE");
  });
});

describe("id-style", function () {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }

  it("Should not report any error for correctly formatted class", async function () {
    const linter = createLinter({
      "id-class-style": [true, "lowercase"]
    });
    const html = "<div></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
    expect(issues[0].severity).to.equal("warning");
    expect(issues[0].code).to.equal("DEPRECATED_RULE");
  });
});
