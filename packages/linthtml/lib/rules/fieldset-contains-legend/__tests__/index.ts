import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | fieldset-contains-legend", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it(
    "Should not report an error when a fieldset contains a legend tag",
    async () => {
      const linter = createLinter({ "fieldset-contains-legend": true });
      const html = "<fieldset><legend>Foo</legend></fieldset>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );

  it(
    "Should report an error when a fieldset does not contains a legend tag",
    async () => {
      const linter = createLinter({ "fieldset-contains-legend": true });
      const html = "<fieldset><div></div></fieldset>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    }
  );
});
describe("fieldset-contains-legend", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it(
    "Should not report an error when a fieldset contains a legend tag",
    async () => {
      const linter = createLinter({ "fieldset-contains-legend": true });
      const html = "<fieldset><legend>Foo</legend></fieldset>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );

  it(
    "Should report an error when a fieldset does not contains a legend tag",
    async () => {
      const linter = createLinter({ "fieldset-contains-legend": true });
      const html = "<fieldset><div></div></fieldset>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    }
  );
});
