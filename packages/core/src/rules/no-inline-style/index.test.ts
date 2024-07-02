import { expect } from "chai";
import linthtml from "../../index.js";
import { presets } from "../../presets/index.js";
import type { LegacyLinterConfig, RuleConfig } from "../../read-config.js";

describe("legacy linter | no-inline-style", function () {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should report an error if tag contains the style attribute", async function () {
    const linter = createLinter({
      "no-inline-style": true
    });
    const issues = await linter.lint("<span style='color: blue;'>Something</span>");
    expect(issues).to.have.lengthOf(1);
    expect(issues[0].code).to.equal("E065");
    expect(issues[0].position).to.deep.equal({
      end: {
        column: 27,
        line: 1
      },
      start: {
        column: 7,
        line: 1
      }
    });
  });

  it("Should not report any error if tag has no style attribute", async function () {
    const linter = createLinter({
      "no-inline-style": true
    });
    const issues = await linter.lint("<span class='bg-red' id='custom-span'>Something</span>");
    expect(issues).to.have.lengthOf(0);
  });
});

describe("no-inline-style", function () {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should report an error if tag contains the style attribute", async function () {
    const linter = createLinter({
      "no-inline-style": true
    });
    const issues = await linter.lint("<span style='color: blue;'>Something</span>");
    expect(issues).to.have.lengthOf(1);
    expect(issues[0].code).to.equal("E065");
    expect(issues[0].position).to.deep.equal({
      end: {
        column: 27,
        line: 1
      },
      start: {
        column: 7,
        line: 1
      }
    });
  });

  it("Should not report any error if tag has no style attribute", async function () {
    const linter = createLinter({
      "no-inline-style": true
    });
    const issues = await linter.lint("<span class='bg-red' id='custom-span'>Something</span>");
    expect(issues).to.have.lengthOf(0);
  });
});
