import { expect } from "chai";
import { createLegacyLinter, createLinter } from "../../__tests__/utils.js";
import { get_config_type } from "../../validate_option.js";

const valid_html = [
  "<div>A simple div</div>",
  "<span>A simple span</span>",
  '<input type="text"/>',
  "<table></table>",
  '<img alt="" role="presentation">',
  '<svg role="presentation"></svg>',
  "<strong>A simple strong</strong>",
  "<button>A simple button</button>"
];

const invalid_tests = [
  {
    html: "<center>Centered html</center>",
    checks: [
      {
        code: "E068",
        position: {
          start: {
            line: 1,
            column: 1
          },
          end: {
            line: 1,
            column: 31
          }
        }
      }
    ]
  },
  {
    html: "<dir><li>Folder</li></dir>",
    checks: [
      {
        code: "E068",
        position: {
          start: {
            line: 1,
            column: 1
          },
          end: {
            line: 1,
            column: 27
          }
        }
      }
    ]
  },
  {
    html: "<font></font>",
    checks: [
      {
        code: "E068",
        position: {
          start: {
            line: 1,
            column: 1
          },
          end: {
            line: 1,
            column: 14
          }
        }
      }
    ]
  },
  {
    html: "<big>Big text</big>",
    checks: [
      {
        code: "E068",
        position: {
          start: {
            line: 1,
            column: 1
          },
          end: {
            line: 1,
            column: 20
          }
        }
      }
    ]
  },
  {
    html: "<acronym>FYI</acronym>",
    checks: [
      {
        code: "E068",
        position: {
          start: {
            line: 1,
            column: 1
          },
          end: {
            line: 1,
            column: 23
          }
        }
      }
    ]
  },
  {
    html: "<marquee>Scrolling text</marquee>",
    checks: [
      {
        code: "E068",
        position: {
          start: {
            line: 1,
            column: 1
          },
          end: {
            line: 1,
            column: 34
          }
        }
      }
    ]
  }
];

describe("Legacy | no-deprecated-tag", function () {
  ["foo", 1, [], /foo/].forEach((config) => {
    it("Should report an error when config is not an object", function () {
      const linter = createLegacyLinter({ "no-deprecated-tag": config });

      expect(() => linter.lint("")).to.throw(
        `Configuration for rule "no-deprecated-tag" is invalid: Expected object got ${get_config_type(config)}`
      );
    });
  });

  valid_html.forEach((html) => {
    it(`Should not report an error for valid html`, async function () {
      const linter = createLegacyLinter({ "no-deprecated-tag": true });

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });
  });

  invalid_tests.forEach((ctx) => {
    it(`Should report an error for "${ctx.html}"`, async function () {
      const linter = createLegacyLinter({ "no-deprecated-tag": true });

      const issues = await linter.lint(ctx.html);
      expect(issues).to.have.lengthOf(ctx.checks.length);
      ctx.checks.forEach((check, i) => {
        expect(issues[i].code).to.equal(check.code);
        expect(issues[i].position).to.deep.equal(check.position);
      });
    });
  });

  it('Should not report an error for a tag listed in the config "allowList" property', async function () {
    const linter = createLegacyLinter({ "no-deprecated-tag": { allowList: ["center"] } });

    const issues = await linter.lint("<center>Centered div</center>");
    expect(issues).to.have.lengthOf(0);
  });
});

describe("no-deprecated-tag", function () {
  [true, "foo", 1, [], /foo/].forEach((config) => {
    it("Should report an error when config is not an object", function () {
      expect(() => createLinter({ "no-deprecated-tag": [true, config] })).to.throw(
        `Configuration for rule "no-deprecated-tag" is invalid: Expected object got ${get_config_type(config)}`
      );
    });
  });

  valid_html.forEach((html) => {
    it(`Should not report an error for valid html`, async function () {
      const linter = createLinter({ "no-deprecated-tag": true });

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });
  });

  invalid_tests.forEach((ctx) => {
    it(`Should report an error for "${ctx.html}"`, async function () {
      const linter = createLinter({ "no-deprecated-tag": true });

      const issues = await linter.lint(ctx.html);
      expect(issues).to.have.lengthOf(ctx.checks.length);
      ctx.checks.forEach((check, i) => {
        expect(issues[i].code).to.equal(check.code);
        expect(issues[i].position).to.deep.equal(check.position);
      });
    });
  });

  it('Should not report an error for a tag listed in the config "allowList" property', async function () {
    const linter = createLinter({ "no-deprecated-tag": [true, { allowList: ["center"] }] });

    const issues = await linter.lint("<center>Centered div</center>");
    expect(issues).to.have.lengthOf(0);
  });
});
