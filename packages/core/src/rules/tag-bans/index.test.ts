import { expect } from "chai";
import linthtml from "../../index.js";
import { presets } from "../../presets/index.js";
import type { LegacyLinterConfig, RuleConfig } from "../../read-config.js";

describe("legacy linter | tag-bans", function () {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should report an error for a tag named 'style'", async function () {
    const linter = createLinter({ "tag-bans": ["style"] });
    const html = "<body><style>hello</style></body>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should accept a single string as option", async function () {
    const linter = createLinter({ "tag-bans": "style" });
    const html = "<style></style>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Banned tags should be case insensitive", async function () {
    const linter = createLinter({ "tag-bans": ["DiV"] });
    const html = "<div></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should throw an error for an invalid config", function () {
    const linter = createLinter({ "tag-bans": true });
    const html = '<button style="color: red;"></button>';
    expect(() => linter.lint(html)).to.throw(
      'Configuration for rule "tag-bans" is invalid: Expected string or string[] got boolean'
    );
  });

  it("Should throw an error if not given a list of strings as config", function () {
    const linter = createLinter({ "tag-bans": ["string", true] });
    const html = '<button style="color: red;"></button>';
    expect(() => linter.lint(html)).to.throw(
      'Configuration for rule "tag-bans" is invalid: Expected string or string[] got boolean[]'
    );
  });
});
describe("tag-bans", function () {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should report an error for a tag named 'style'", async function () {
    const linter = createLinter({
      "tag-bans": [true, ["style"]]
    });
    const html = "<body><style>hello</style></body>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should accept a single string as option", async function () {
    const linter = createLinter({
      "tag-bans": [true, "style"]
    });
    const html = "<style></style>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Banned tags should be case insensitive", async function () {
    const linter = createLinter({
      "tag-bans": [true, "DiV"]
    });
    const html = "<div></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should throw an error for an invalid config", function () {
    const config = {
      "tag-bans": [true, true] as [boolean, unknown]
    };
    expect(() => createLinter(config)).to.throw(
      'Configuration for rule "tag-bans" is invalid: Expected string or string[] got boolean'
    );
  });

  it("Should throw an error if not given a list of strings as config", function () {
    const config = {
      "tag-bans": [true, ["string", true]] as [boolean, unknown]
    };
    expect(() => createLinter(config)).to.throw(
      'Configuration for rule "tag-bans" is invalid: Expected string or string[] got boolean[]'
    );
  });
});
