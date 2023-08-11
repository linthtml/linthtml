import Config from "../config";
import type { LegacyRuleDefinition, RuleDefinition } from "../read-config";
import rules from "../rules";
// TODO: Remove .default after typescript migration

describe("Config", () => {
  let testContext: any;

  beforeEach(() => {
    testContext = {};
  });

  // let config = new Config(rules);

  describe("getRule", () => {
    it("Should throw an error when trying to get an unexisting rule", () => {
      const config = new Config();
      expect(() => config.getRule("foo")).toThrow('Rule "foo" does not exist.');
    });
    it("Should return existing rules", () => {
      const config = new Config(rules);
      const rule = config.getRule("attr-bans");
      // config.setRuleConfig()

      expect(rule.name).toBe("attr-bans");
      expect(rule.lint).toBeDefined();
    });
  });

  describe("Rule activation", () => {
    this.beforeEach(function () {
      this.config = new Config(rules);
    });
    describe("Boolean config", () => {
      it('Should activate rule if "true" is provided', () => {
        const rule = testContext.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": true
        };
        testContext.config.setRuleConfig(rule, rule_config);
        expect(testContext.config.activated_rules).to.have.any.keys("attr-bans");
      });
      it('Should not activate rule if "false" is provided', () => {
        const rule = testContext.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": false
        };
        testContext.config.setRuleConfig(rule, rule_config);
        expect(testContext.config.activated_rules).to.not.have.any.keys("attr-bans");
      });
    });
    describe("String config", () => {
      it('Should activate rule if "error" is provided', () => {
        const rule = testContext.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": "error"
        };
        testContext.config.setRuleConfig(rule, rule_config);
        expect(testContext.config.activated_rules).to.have.any.keys("attr-bans");
      });
      it('Should activate rule if "warning" is provided', () => {
        const rule = testContext.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": "warning"
        };
        testContext.config.setRuleConfig(rule, rule_config);
        expect(testContext.config.activated_rules).to.have.any.keys("attr-bans");
      });
      it('Should not activate rule if "off" is provided', () => {
        const rule = testContext.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": "off"
        };
        testContext.config.setRuleConfig(rule, rule_config);
        expect(testContext.config.activated_rules).to.not.have.any.keys("attr-bans");
      });
      it(
        "Should report an error if an invalid string is provided to activate rule",
        () => {
          const config = new Config(rules);
          const rule = config.getRule("attr-bans");
          const rule_config = {
            "attr-bans": "foo"
          };

          // @ts-expect-error provided config is invalid and the test is validating that
          expect(() => config.setRuleConfig(rule, rule_config)).toThrow('Invalid Config for rule "attr-bans" - Unexpected string value "foo"');
        }
      );
    });
    describe("Object config", () => {
      it("Should report an error if a js object is provided", () => {
        const config = new Config(rules);
        const rule = config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": {
            foo: "bar"
          }
        };
        // @ts-expect-error provided config is invalid and the test is validating that
        expect(() => config.setRuleConfig(rule, rule_config)).toThrow('Invalid Config for rule "attr-bans" - Unexpected value "{"foo":"bar"}"');
      });
      it("Should report an error if a js object is provided", () => {
        const config = new Config(rules);
        const rule = config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": []
        };
        // @ts-expect-error provided config is invalid and the test is validating that
        expect(() => config.setRuleConfig(rule, rule_config)).toThrow('Invalid Config for rule "attr-bans" - Unexpected value "undefined"');
      });
      it(
        'Should activate rule is first value of array is "true" (boolean)',
        () => {
          const rule = testContext.config.getRule("attr-bans");
          const rule_config = {
            "attr-bans": [true]
          };
          testContext.config.setRuleConfig(rule, rule_config);
          expect(testContext.config.activated_rules).to.have.any.keys("attr-bans");
        }
      );

      it(
        'Should not activate rule is first value of array is "false" (boolean)',
        () => {
          const rule = testContext.config.getRule("attr-bans");
          const rule_config = {
            "attr-bans": [false]
          };
          testContext.config.setRuleConfig(rule, rule_config);
          expect(testContext.config.activated_rules).to.not.have.any.keys("attr-bans");
        }
      );

      it('Should activate rule is first value of array is "error"', () => {
        const rule = testContext.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": ["error"]
        };
        testContext.config.setRuleConfig(rule, rule_config);
        expect(testContext.config.activated_rules).to.have.any.keys("attr-bans");
      });

      it('Should activate rule is first value of array is "warning"', () => {
        const rule = testContext.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": ["warning"]
        };
        testContext.config.setRuleConfig(rule, rule_config);
        expect(testContext.config.activated_rules).to.have.any.keys("attr-bans");
      });

      it('Should not activate rule is first value of array is "off"', () => {
        const rule = testContext.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": ["off"]
        };
        testContext.config.setRuleConfig(rule, rule_config);
        expect(testContext.config.activated_rules).to.not.have.any.keys("attr-bans");
      });
    });

    describe("Dummy configs", () => {
      // this.beforeEach(function() {
      //   this.config = new Config(rules);
      // });
      it(
        "Should report an error if the first value of the config array is an empty object",
        () => {
          const config = new Config(rules);
          const rule = config.getRule("attr-bans");
          const rule_config = {
            "attr-bans": []
          };
          // @ts-expect-error provided config is invalid and the test is validating that
          expect(() => config.setRuleConfig(rule, rule_config)).toThrow('Invalid Config for rule "attr-bans" - Unexpected value "undefined"');
        }
      );
      it(
        "Should report an error if the first value of the config array is a number",
        () => {
          const config = new Config(rules);
          const rule = config.getRule("attr-bans");
          const rule_config = {
            "attr-bans": [1]
          };
          // @ts-expect-error provided config is invalid and the test is validating that
          expect(() => config.setRuleConfig(rule, rule_config)).toThrow('Invalid Config for rule "attr-bans" - Unexpected value "1"');
        }
      );
      it("Should report an error if a number is provided", () => {
        const config = new Config(rules);
        const rule = config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": 1
        };
        // @ts-expect-error provided config is invalid and the test is validating that
        expect(() => config.setRuleConfig(rule, rule_config)).toThrow('Invalid Config for rule "attr-bans" - Unexpected value "1"');
      });
    });

    it("Should set rule severity to 'error' by default", () => {
      const rule = testContext.config.getRule("attr-bans");
      const rule_config = {
        "attr-bans": true
      };
      testContext.config.setRuleConfig(rule, rule_config);
      expect(testContext.config.activated_rules["attr-bans"].severity).toBe("error");
    });

    it("Should set rule severity to 'error' when specified", () => {
      const rule = testContext.config.getRule("attr-bans");
      const rule_config = {
        "attr-bans": "error"
      };
      testContext.config.setRuleConfig(rule, rule_config);
      expect(testContext.config.activated_rules["attr-bans"].severity).toBe("error");
    });

    it("Should set rule severity to 'warning' when specified", () => {
      const rule = testContext.config.getRule("attr-bans");
      const rule_config = {
        "attr-bans": "warning"
      };
      testContext.config.setRuleConfig(rule, rule_config);
      expect(testContext.config.activated_rules["attr-bans"].severity).toBe("warning");
    });
  });

  describe("Rules config", () => {
    it("Should not throw and error if no config is provided", () => {
      const config = new Config(rules);
      const rule = config.getRule("attr-bans");
      const rule_config = {
        "attr-bans": ["error"]
      } as const;
      // @ts-ignore
      expect(() => config.setRuleConfig(rule, rule_config)).not.toThrow();
    });
    describe("Rule validation", () => {
      it('Should call "validateConfig" if rule declare the function', done => {
        const rule_config = {
          foo: [
            "error",
            {
              bar: "bar"
            }
          ] as ["error", unknown]
        } as const;
        const foo: RuleDefinition = {
          name: "foo",
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          lint() {},
          validateConfig(config) {
            expect(config).toBeDefined();
            // @ts-ignore
            expect(config.bar).toBe("bar");
            done();
          }
        };

        const config = new Config([foo as LegacyRuleDefinition]);
        const rule = config.getRule("foo");
        config.setRuleConfig(rule, rule_config);
      });

      it('Should call "configTransform" if rule declare the function', done => {
        const rule_config = {
          foo: [
            "error",
            {
              bar: "bar"
            }
          ] as ["error", unknown]
        } as const;
        const foo: RuleDefinition = {
          name: "foo",
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          lint() {},
          configTransform(config) {
            // @ts-ignore
            return config.bar;
          },
          validateConfig(config) {
            expect(config).toBeDefined();
            expect(config).toBe("bar");
            done();
          }
        };

        const config = new Config([foo as LegacyRuleDefinition]);
        const rule = config.getRule("foo");
        config.setRuleConfig(rule, rule_config);
      });
    });
  });

  describe("Rules severity", () => {
    this.beforeEach(function () {
      this.config = new Config(rules);
    });
    it('Rules severity should be set as "error" by default', () => {
      const rule = testContext.config.getRule("attr-bans");
      const rule_config = {
        "attr-bans": true
      };
      testContext.config.setRuleConfig(rule, rule_config);
      expect(testContext.config.activated_rules["attr-bans"]).toHaveProperty("severity", "error");
    });
    it('Rules severity should be set as "error" if "error" is provided', () => {
      const rule = testContext.config.getRule("attr-bans");
      const rule_config = {
        "attr-bans": "error"
      };
      testContext.config.setRuleConfig(rule, rule_config);
      expect(testContext.config.activated_rules["attr-bans"]).toHaveProperty("severity", "error");
    });
    it(
      'Rules severity should be set as "warning" if "warning" is provided',
      () => {
        const rule = testContext.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": "warning"
        };
        testContext.config.setRuleConfig(rule, rule_config);
        expect(testContext.config.activated_rules["attr-bans"]).toHaveProperty("severity", "warning");
      }
    );
  });
});
