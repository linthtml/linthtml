import { expect } from "chai";
import linthtml from "../../index.js";
import { presets } from "../../presets/index.js";
import type { LegacyLinterConfig, RuleConfig } from "../../read-config.js";

describe("legacy linter | tag-req-attr", function () {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should not report any error when config is an empty object", async function () {
    const linter = createLinter({ "tag-req-attr": {} });
    const html = "<img />";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error when tag contain mandatory attributes", async function () {
    const linter = createLinter({
      "tag-req-attr": { img: [{ name: "src" }, { name: "alt" }] }
    });
    const html = '<img src="nyan.mrw" alt="nyan" />';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should an report an error per missing attributes", async function () {
    const linter = createLinter({
      "tag-req-attr": { img: [{ name: "src" }, { name: "alt" }] }
    });
    const html = "<img/>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Mandatory attributes should not be empty by default", async function () {
    const linter = createLinter({
      "tag-req-attr": { input: [{ name: "required" }] }
    });
    const html = "<input required />";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it('Should not report an error for empty attribute when "allowEmpty" is specified', async function () {
    const linter = createLinter({
      "tag-req-attr": { input: [{ name: "required", allowEmpty: true }] }
    });
    const html = "<input required />";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error when there's no configuration for the tag", async function () {
    const linter = createLinter({
      "tag-req-attr": { input: [{ name: "required", allowEmpty: true }] }
    });
    const html = "<img />";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should throw an error for an invalid config", function () {
    const linter = createLinter({ "tag-req-attr": "foo" });
    const html = "";
    expect(() => linter.lint(html)).to.throw(
      'Configuration for rule "tag-req-attr" is invalid: Expected object got string'
    );
  });
});

describe("tag-req-attr", function () {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report any error when config is an empty object", async function () {
    const linter = createLinter({
      "tag-req-attr": [true, {}]
    });
    const html = "<img />";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error when tag contain mandatory attributes", async function () {
    const linter = createLinter({
      "tag-req-attr": [
        true,
        {
          img: [{ name: "src" }, { name: "alt" }]
        }
      ]
    });
    const html = '<img src="nyan.mrw" alt="nyan" />';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should an report an error per missing attributes", async function () {
    const linter = createLinter({
      "tag-req-attr": [
        true,
        {
          img: [{ name: "src" }, { name: "alt" }]
        }
      ]
    });
    const html = "<img/>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Mandatory attributes should not be empty by default", async function () {
    const linter = createLinter({
      "tag-req-attr": [
        true,
        {
          input: [{ name: "required" }]
        }
      ]
    });
    const html = "<input required />";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it('Should not report an error for empty attribute when "allowEmpty" is specified', async function () {
    const linter = createLinter({
      "tag-req-attr": [
        true,
        {
          input: [{ name: "required", allowEmpty: true }]
        }
      ]
    });
    const html = "<input required />";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error when there's no configuration for the tag", async function () {
    const linter = createLinter({
      "tag-req-attr": [
        true,
        {
          input: [{ name: "required", allowEmpty: true }]
        }
      ]
    });
    const html = "<img />";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should throw an error for an invalid config", function () {
    const config = {
      "tag-req-attr": [true, "foo"] as [boolean, unknown]
    };
    expect(() => createLinter(config)).to.throw(
      'Configuration for rule "tag-req-attr" is invalid: Expected object got string'
    );
  });
});

// module.exports = [
//   {
//     desc: "should pass when there is no configuration for the tag",
//     input: '<img src="nyan.mrw" alt="" />',
//     opts: {
//       "tag-req-attr": {
//         input: [
//           {
//             name: "type"
//           }
//         ]
//       }
//     },
//     output: 0
//   }
// ];
