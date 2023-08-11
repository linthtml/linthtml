import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | id-style", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  // it("Should ignore id matching \"raw-ignore-text\"", async function() {
  //   const linter = createLinter({
  //     "id-style": "dash",
  //     "raw-ignore-regex": "{{.*?}}"
  //   });
  //   const html = "<div id=\"{{ if }} foo {{ else }} bar {{ end }}\"></div>";
  //   const issues = await linter.lint(html);
  //   expect(issues).to.have.lengthOf(0);
  // });

  it(
    "Should not report any error for correctly formatted id",
    async () => {
      const linter = createLinter({ "id-style": "lowercase" });
      const html = '<div id="foo"></div>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );

  describe("'lowercase' format", () => {
    it(
      "Should not report an error for ids with valid format",
      async () => {
        const linter = createLinter({ "id-style": "lowercase" });
        const html = '<div id="foo"></div>';
        const issues = await linter.lint(html);
        expect(issues).toHaveLength(0);
      }
    );

    it("Should report an error for ids with invalid format", async () => {
      const linter = createLinter({ "id-style": "lowercase" });
      const html = '<div id="bar-foo"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });

  describe("'dash' format", () => {
    it(
      "Should not report an error for ids with valid format",
      async () => {
        const linter = createLinter({ "id-style": "dash" });
        const html = '<div id="bar-foo"></div>';
        const issues = await linter.lint(html);
        expect(issues).toHaveLength(0);
      }
    );

    it("Should report an error for ids with invalid format", async () => {
      const linter = createLinter({ "id-style": "dash" });
      const html = '<div id="BarFoo"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });

  describe("'underscore' format", () => {
    it(
      "Should not report an error for ids with valid format",
      async () => {
        const linter = createLinter({ "id-style": "underscore" });
        const html = '<div id="bar_foo"></div>';
        const issues = await linter.lint(html);
        expect(issues).toHaveLength(0);
      }
    );

    it("Should report an error for ids with invalid format", async () => {
      const linter = createLinter({ "id-style": "underscore" });
      const html = '<div id="BarFoo"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });

  describe("'BEM' format", () => {
    it(
      "Should not report an error for ids with valid format",
      async () => {
        const linter = createLinter({ "id-style": "bem" });
        const html = '<div id="block__element"></div>';
        const issues = await linter.lint(html);
        expect(issues).toHaveLength(0);
      }
    );

    it("Should report an error for ids with invalid format", async () => {
      const linter = createLinter({ "id-style": "bem" });
      const html = '<div id="block--modifier--modifier"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });

  describe("'regexp' format", () => {
    it(
      "Should not report an error for ids with valid format",
      async () => {
        const linter = createLinter({ "id-style": /^foo-\d+$/ });
        const html = '<div id="foo-1"></div>';
        const issues = await linter.lint(html);
        expect(issues).toHaveLength(0);
      }
    );

    it("Should report an error for ids with invalid format", async () => {
      const linter = createLinter({ "id-style": /^foo-\d+$/ });
      const html = '<div id="bar-2"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });

  it(
    "Should fallback to `id-class-style` if `id-style` is false",
    async () => {
      const linter = createLinter({
        "id-style": false,
        "id-class-style": "lowercase"
      });
      const html = '<div id="FOO"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    }
  );

  it(
    "Should not fallback to `id-class-style` if `id-style` is set to `none`",
    async () => {
      const linter = createLinter({
        "id-style": "none",
        "id-class-style": "lowercase"
      });
      const html = '<div id="FOO"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );

  it("Should throw an error if `id-class-ignore-regex` is empty", () => {
    const linter = createLinter({
      "id-style": "dash",
      "id-class-ignore-regex": ""
    });
    const html = '<div id="bar-2"></div>';

    expect(() => linter.lint(html)).toThrow(
      'Configuration for rule "id-class-ignore-regex" is invalid: You provide an empty string value'
    );
  });

  it("Rule should not fail if id attribute has no value", async () => {
    const linter = createLinter({ "id-style": "dash" });
    const html = `
      <div id></div>
    `;

    expect(() => linter.lint(html)).not.toThrow();
  });

  it("should throw an error if rule config is empty", () => {
    const linter = createLinter({ "id-style": "" });

    expect(() => linter.lint("")).toThrow(
      'Configuration for rule "id-style" is invalid: "" is not accepted. Accepted values are "none", "lowercase", "underscore", "dash", "camel" and "bem"'
    );
  });

  it(
    "should throw an error if rule config is provided with an invalid format",
    () => {
      const linter = createLinter({ "id-style": "foo" });

      expect(() => linter.lint("")).toThrow(
        'Configuration for rule "id-style" is invalid: "foo" is not accepted. Accepted values are "none", "lowercase", "underscore", "dash", "camel" and "bem"'
      );
    }
  );
});

describe("id-style", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  // TOFIX
  // it("Should ignore id matching \"raw-ignore-text\"", async function() {
  //   const linter = linthtml.fromConfig({
  //     "raw-ignore-regex": "{{.*?}}",
  //     rules: {
  //       "id-style": [
  //         true,
  //         "dash"
  //       ]
  //     }
  //   });
  //   const html = "<div id=\"{{ if }} foo {{ else }} bar {{ end }}\"></div>";
  //   const issues = await linter.lint(html);
  //   expect(issues).to.have.lengthOf(0);
  // });

  it(
    "Should not report any error for correctly formatted id",
    async () => {
      const linter = createLinter({
        "id-style": [true, "lowercase"]
      });
      const html = '<div id="foo"></div>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );

  describe("'lowercase' format", () => {
    it(
      "Should not report an error for ids with valid format",
      async () => {
        const linter = createLinter({
          "id-style": [true, "lowercase"]
        });
        const html = '<div id="foo"></div>';
        const issues = await linter.lint(html);
        expect(issues).toHaveLength(0);
      }
    );

    it("Should report an error for ids with invalid format", async () => {
      const linter = createLinter({
        "id-style": [true, "lowercase"]
      });
      const html = '<div id="bar-foo"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });

  describe("'dash' format", () => {
    it(
      "Should not report an error for ids with valid format",
      async () => {
        const linter = createLinter({
          "id-style": [true, "dash"]
        });
        const html = '<div id="bar-foo"></div>';
        const issues = await linter.lint(html);
        expect(issues).toHaveLength(0);
      }
    );

    it("Should report an error for ids with invalid format", async () => {
      const linter = createLinter({
        "id-style": [true, "dash"]
      });
      const html = '<div id="BarFoo"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });

  describe("'underscore' format", () => {
    it(
      "Should not report an error for ids with valid format",
      async () => {
        const linter = createLinter({
          "id-style": [true, "underscore"]
        });
        const html = '<div id="bar_foo"></div>';
        const issues = await linter.lint(html);
        expect(issues).toHaveLength(0);
      }
    );

    it("Should report an error for ids with invalid format", async () => {
      const linter = createLinter({
        "id-style": [true, "underscore"]
      });
      const html = '<div id="BarFoo"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });

  describe("'BEM' format", () => {
    it(
      "Should not report an error for ids with valid format",
      async () => {
        const linter = createLinter({
          "id-style": [true, "bem"]
        });
        const html = '<div id="block__element"></div>';
        const issues = await linter.lint(html);
        expect(issues).toHaveLength(0);
      }
    );

    it("Should report an error for ids with invalid format", async () => {
      const linter = createLinter({
        "id-style": [true, "bem"]
      });
      const html = '<div id="block--modifier--modifier"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });

  describe("'regexp' format", () => {
    it(
      "Should not report an error for ids with valid format",
      async () => {
        const linter = createLinter({
          "id-style": [true, /^foo-\d+$/]
        });
        const html = '<div id="foo-1"></div>';
        const issues = await linter.lint(html);
        expect(issues).toHaveLength(0);
      }
    );

    it("Should report an error for ids with invalid format", async () => {
      const linter = createLinter({
        "id-style": [true, /^foo-\d+$/]
      });
      const html = '<div id="bar-2"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });

  it("Rule should not fail if id attribute has no value", async () => {
    const linter = createLinter({
      "id-style": [true, "dash"]
    });
    const html = `
      <div id></div>
    `;

    expect(() => linter.lint(html)).not.toThrow();
  });

  it(
    "Should fallback to `id-class-style` if `id-style` is false",
    async () => {
      const linter = createLinter({
        "id-style": false,
        "id-class-style": [true, "lowercase"]
      });
      const html = '<div id="FOO"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    }
  );

  it(
    "Should not fallback to `id-class-style` if `id-style` is set to `none`",
    async () => {
      const linter = createLinter({
        "id-style": [true, "none"],
        "id-class-style": [true, "lowercase"]
      });
      const html = '<div id="FOO"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );

  it("should throw an error if rule config is empty", () => {
    const config = {
      "id-style": [true, ""] as [boolean, unknown]
    };

    expect(() => createLinter(config)).toThrow(
      'Configuration for rule "id-style" is invalid: "" is not accepted. Accepted values are "none", "lowercase", "underscore", "dash", "camel" and "bem"'
    );
  });

  it(
    "should throw an error if rule config is provided with an invalid format",
    () => {
      const config = {
        "id-style": [true, "foo"] as [boolean, unknown]
      };

      expect(() => createLinter(config)).toThrow(
        'Configuration for rule "id-style" is invalid: "foo" is not accepted. Accepted values are "none", "lowercase", "underscore", "dash", "camel" and "bem"'
      );
    }
  );
});
