import linthtml from "../../index";
import { presets } from "../../presets";
import { LegacyLinterConfig } from "../../read-config";

function createLinter(presets: LegacyLinterConfig, config: LegacyLinterConfig) {
  return new linthtml.LegacyLinter(linthtml.rules, presets, config);
}
describe("raw-ignore-regex", () => {
  it("should remove matching text", async () => {
    const linter = createLinter(presets.none, { "raw-ignore-regex": /\r/ });
    const html = "\r\r\r\r[[\r\n\t fjq\r\n\r]]\r\r\n";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("should work across line breaks", async () => {
    const linter = createLinter(presets.none, {
      "raw-ignore-regex": /\[\[[^]*?\]\]/
    });
    const html = "\r\r\r\r[[\r\n\t fjq\r\n\r]]\r\r";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("should work across line breaks", async () => {
    const linter = createLinter(presets.none, {
      "raw-ignore-regex": /(\{[^]*?\}|\[\[[^]*?\]\])/
    });
    const html = "\r{\r\r}\r[[\r\n\t fjq\r\n\r]]\r\r";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("should not cause any error with text", async () => {
    const linter = createLinter(presets.default, {
      "raw-ignore-regex": /{{.*}}/
    });
    const html = ["<p>", "\t{{ .aVariable }}", "</p>"].join("\n");

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("should not cause any error inside attributes work across line break", async () => {
    const linter = createLinter(presets.default, {
      "raw-ignore-regex": /{{.*}}/
    });
    const html = '<p class="a {{ if $bar "bar" . }} c {{else}} b{{ /if }}">foo</p>';
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("should not cause any error inside on multiline", async () => {
    const linter = createLinter(presets.default, {
      "raw-ignore-regex": /{{(.*[\n\r].*)+}}/
    });
    const html = ["<p>", "\t{{ ", "\t .aVariable", "\t }}", "</p>"].join("\n");
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });
});
