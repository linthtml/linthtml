import { LegacyLinterConfig, RuleConfig } from "../../../read-config.js";
import linthtml from "../../../index.js";
import { presets } from "../../../presets/index.js";

describe("legacy linter | attr-validate", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should report an error when given malformed attributes", async () => {
    const linter = createLinter({ "attr-req-value": true });
    const html = '<div class="large id="title"></div>';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should report only one error per malformed attributes", async () => {
    const linter = createLinter({ "attr-validate": true });
    const html = '<div class=large"><p class=="bold">text</p></div>';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it("Should not report an error for self-closing tags with no space before", async () => {
    const linter = createLinter({ "attr-validate": true });
    const html = '<meta charset="utf-8"/>';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });
});
describe("attr-validate", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should report an error when given malformed attributes", async () => {
    const linter = createLinter({ "attr-validate": true });
    const html = '<div class="large id="title"></div>';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should report only one error per malformed attributes", async () => {
    const linter = createLinter({ "attr-validate": true });
    const html = '<div class=large"><p class=="bold">text</p></div>';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it("Should not report an error for self-closing tags with no space before", async () => {
    const linter = createLinter({ "attr-validate": true });
    const html = '<meta charset="utf-8"/>';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });
});

// module.exports = [
//   {
//     /// NOt sure about the test + attributes should not allow \n \r
//     desc: "should pass valid attribute list 2",
//     input: "<div\t  claSs =\"large\" id=a\nid\r='\n\tb  ' ></div>",
//     opts: { "attr-validate": true },
//     output: 0
//   },
// ];
