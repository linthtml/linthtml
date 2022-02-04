// TODO: Remove .default after typescript migration
import linthtml from "../../lib";
import { presets } from "../../lib/presets";
import { expect } from "chai";
import { LegacyLinterConfig } from "../../lib/read-config";

function createLinter(presets: LegacyLinterConfig, config: LegacyLinterConfig) {
  return new linthtml.LegacyLinter(linthtml.rules, presets, config);
}
describe("raw-ignore-regex", function () {
  it("should remove matching text", async function () {
    const linter = createLinter(presets.none, { "raw-ignore-regex": /\r/ });
    const html = "\r\r\r\r[[\r\n\t fjq\r\n\r]]\r\r\n";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("should work across line breaks", async function () {
    const linter = createLinter(presets.none, {
      "raw-ignore-regex": /\[\[[^]*?\]\]/
    });
    const html = "\r\r\r\r[[\r\n\t fjq\r\n\r]]\r\r";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("should work across line breaks", async function () {
    const linter = createLinter(presets.none, {
      "raw-ignore-regex": /(\{[^]*?\}|\[\[[^]*?\]\])/
    });
    const html = "\r{\r\r}\r[[\r\n\t fjq\r\n\r]]\r\r";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("should not cause any error with text", async function () {
    const linter = createLinter(presets.default, {
      "raw-ignore-regex": /{{.*}}/
    });
    const html = ["<p>", "\t{{ .aVariable }}", "</p>"].join("\n");

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("should not cause any error inside attributes work across line break", async function () {
    const linter = createLinter(presets.default, {
      "raw-ignore-regex": /{{.*}}/
    });
    const html = '<p class="a {{ if $bar "bar" . }} c {{else}} b{{ /if }}">foo</p>';
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("should not cause any error inside on multiline", async function () {
    const linter = createLinter(presets.default, {
      "raw-ignore-regex": /{{(.*[\n\r].*)+}}/
    });
    const html = ["<p>", "\t{{ ", "\t .aVariable", "\t }}", "</p>"].join("\n");
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});
