import { expect } from "chai";
import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | title-max-len", function () {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should not report any error when the title does exceed max length", async function () {
    const linter = createLinter({ "title-max-len": 60 });
    const html = "<head><title>Title!</title></head>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error when the title length equal the max length", async function () {
    const linter = createLinter({ "title-max-len": 5 });
    const html = "<head><title>Title</title></head>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when the title does exceed the max length", async function () {
    const linter = createLinter({ "title-max-len": 5 });
    const html = "<head><title>Title!</title></head>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should throw an error if not given a number as config", function () {
    const linter = createLinter({ "title-max-len": "foo" });
    const html = "";
    expect(() => linter.lint(html)).to.throw(
      'Configuration for rule "title-max-len" is invalid: Expected number got string'
    );
  });

  it("Should throw an error if not given a positive number as config", function () {
    const linter = createLinter({ "title-max-len": -1 });
    const html = "";
    expect(() => linter.lint(html)).to.throw(
      'Configuration for rule "title-max-len" is invalid: Only positive indent value are allowed.'
    );
  });
});

describe("title-max-len", function () {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report any error when the title does exceed max length", async function () {
    const linter = createLinter({
      "title-max-len": [true, 60]
    });
    const html = "<head><title>Title!</title></head>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error when the title length equal the max length", async function () {
    const linter = createLinter({
      "title-max-len": [true, 5]
    });
    const html = "<head><title>Title</title></head>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when the title does exceed the max length", async function () {
    const linter = createLinter({
      "title-max-len": [true, 5]
    });
    const html = "<head><title>Title!</title></head>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should throw an error if not given a number as config", function () {
    const config = {
      "title-max-len": [true, "foo"] as [boolean, unknown]
    };
    expect(() => createLinter(config)).to.throw(
      'Configuration for rule "title-max-len" is invalid: Expected number got string'
    );
  });

  it("Should throw an error if not given a positive number as config", function () {
    const config = {
      "title-max-len": [true, -1] as [boolean, unknown]
    };
    expect(() => createLinter(config)).to.throw(
      'Configuration for rule "title-max-len" is invalid: Only positive indent value are allowed.'
    );
  });
});
