import { expect } from "chai";
// TODO: Remove .default after typescript migration
import Config from "../lib/config";
import { LegacyRuleDefinition, RuleDefinition } from "../lib/read-config";
import rules from "../lib/rules";

describe("Config", function () {
  // let config = new Config(rules);

  describe("getRule", function () {
    it("Should throw an error when trying to get an unexisting rule", function () {
      const config = new Config();
      expect(() => config.getRule("foo")).to.throw('Rule "foo" does not exist.');
    });
    it("Should return existing rules", function () {
      const config = new Config(rules);
      const rule = config.getRule("attr-bans");
      // config.setRuleConfig()

      expect(rule.name).to.equal("attr-bans");
      expect(rule.lint).to.not.be.undefined;
    });
  });

  describe("Rule activation", function () {
    this.beforeEach(function () {
      this.config = new Config(rules);
    });
    describe("Boolean config", function () {
      it('Should activate rule if "true" is provided', function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": true
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activated_rules).to.have.any.keys("attr-bans");
      });
      it('Should not activate rule if "false" is provided', function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": false
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activated_rules).to.not.have.any.keys("attr-bans");
      });
    });
    describe("String config", function () {
      it('Should activate rule if "error" is provided', function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": "error"
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activated_rules).to.have.any.keys("attr-bans");
      });
      it('Should activate rule if "warning" is provided', function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": "warning"
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activated_rules).to.have.any.keys("attr-bans");
      });
      it('Should not activate rule if "off" is provided', function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": "off"
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activated_rules).to.not.have.any.keys("attr-bans");
      });
      it("Should report an error if an invalid string is provided to activate rule", function () {
        const config = new Config(rules);
        const rule = config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": "foo"
        };
        // @ts-ignore
        expect(() => config.setRuleConfig(rule, rule_config)).to.throw(
          'Invalid Config for rule "attr-bans" - Unexpected string value "foo"'
        );
      });
    });
    describe("Object config", function () {
      it("Should report an error if a js object is provided", function () {
        const config = new Config(rules);
        const rule = config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": {
            foo: "bar"
          }
        };
        // @ts-ignore
        expect(() => config.setRuleConfig(rule, rule_config)).to.throw(
          'Invalid Config for rule "attr-bans" - Unexpected value "{"foo":"bar"}"'
        );
      });
      it("Should report an error if a js object is provided", function () {
        const config = new Config(rules);
        const rule = config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": []
        };
        // @ts-ignore
        expect(() => config.setRuleConfig(rule, rule_config)).to.throw(
          'Invalid Config for rule "attr-bans" - Unexpected value "undefined"'
        );
      });
      it('Should activate rule is first value of array is "true" (boolean)', function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": [true]
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activated_rules).to.have.any.keys("attr-bans");
      });

      it('Should not activate rule is first value of array is "false" (boolean)', function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": [false]
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activated_rules).to.not.have.any.keys("attr-bans");
      });

      it('Should activate rule is first value of array is "error"', function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": ["error"]
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activated_rules).to.have.any.keys("attr-bans");
      });

      it('Should activate rule is first value of array is "warning"', function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": ["warning"]
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activated_rules).to.have.any.keys("attr-bans");
      });

      it('Should not activate rule is first value of array is "off"', function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": ["off"]
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activated_rules).to.not.have.any.keys("attr-bans");
      });
    });

    describe("Dummy configs", function () {
      // this.beforeEach(function() {
      //   this.config = new Config(rules);
      // });
      it("Should report an error if the first value of the config array is an empty object", function () {
        const config = new Config(rules);
        const rule = config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": []
        };
        // @ts-ignore
        expect(() => config.setRuleConfig(rule, rule_config)).to.throw(
          'Invalid Config for rule "attr-bans" - Unexpected value "undefined"'
        );
      });
      it("Should report an error if the first value of the config array is a number", function () {
        const config = new Config(rules);
        const rule = config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": [1]
        };
        // @ts-ignore
        expect(() => config.setRuleConfig(rule, rule_config)).to.throw(
          'Invalid Config for rule "attr-bans" - Unexpected value "1"'
        );
      });
      it("Should report an error if a number is provided", function () {
        const config = new Config(rules);
        const rule = config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": 1
        };
        // @ts-ignore
        expect(() => config.setRuleConfig(rule, rule_config)).to.throw(
          'Invalid Config for rule "attr-bans" - Unexpected value "1"'
        );
      });
    });

    it("Should set rule severity to 'error' by default", function () {
      const rule = this.config.getRule("attr-bans");
      const rule_config = {
        "attr-bans": true
      };
      this.config.setRuleConfig(rule, rule_config);
      expect(this.config.activated_rules["attr-bans"].severity).to.equal("error");
    });

    it("Should set rule severity to 'error' when specified", function () {
      const rule = this.config.getRule("attr-bans");
      const rule_config = {
        "attr-bans": "error"
      };
      this.config.setRuleConfig(rule, rule_config);
      expect(this.config.activated_rules["attr-bans"].severity).to.equal("error");
    });

    it("Should set rule severity to 'warning' when specified", function () {
      const rule = this.config.getRule("attr-bans");
      const rule_config = {
        "attr-bans": "warning"
      };
      this.config.setRuleConfig(rule, rule_config);
      expect(this.config.activated_rules["attr-bans"].severity).to.equal("warning");
    });
  });

  describe("Rules config", function () {
    it("Should not throw and error if no config is provided", function () {
      const config = new Config(rules);
      const rule = config.getRule("attr-bans");
      const rule_config = {
        "attr-bans": ["error"]
      };
      // @ts-ignore
      expect(() => config.setRuleConfig(rule, rule_config)).to.not.throw();
    });
    describe("Rule validation", function () {
      it('Should call "validateConfig" if rule declare the function', function (done) {
        const foo: RuleDefinition = {
          name: "foo",
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          lint() {},
          validateConfig(config) {
            expect(config).to.not.be.undefined;
            // @ts-ignore
            expect(config.bar).to.equal("bar");
            done();
          }
        };
        const config = new Config([foo as LegacyRuleDefinition]);
        const rule = config.getRule("foo");
        const rule_config = {
          foo: [
            "error",
            {
              bar: "bar"
            }
          ] as ["error", unknown]
        };
        config.setRuleConfig(rule, rule_config);
      });

      it('Should call "configTransform" if rule declare the function', function (done) {
        const foo: RuleDefinition = {
          name: "foo",
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          lint() {},
          configTransform(config: any) {
            return config.bar;
          },
          validateConfig(config) {
            expect(config).to.not.be.undefined;
            expect(config).to.equal("bar");
            done();
          }
        };

        const config = new Config([foo as LegacyRuleDefinition]);
        const rule = config.getRule("foo");
        const rule_config = {
          foo: [
            "error",
            {
              bar: "bar"
            }
          ] as ["error", unknown]
        };
        config.setRuleConfig(rule, rule_config);
      });
    });
  });

  describe("Rules severity", function () {
    this.beforeEach(function () {
      this.config = new Config(rules);
    });
    it('Rules severity should be set as "error" by default', function () {
      const rule = this.config.getRule("attr-bans");
      const rule_config = {
        "attr-bans": true
      };
      this.config.setRuleConfig(rule, rule_config);
      expect(this.config.activated_rules["attr-bans"]).to.have.property("severity", "error");
    });
    it('Rules severity should be set as "error" if "error" is provided', function () {
      const rule = this.config.getRule("attr-bans");
      const rule_config = {
        "attr-bans": "error"
      };
      this.config.setRuleConfig(rule, rule_config);
      expect(this.config.activated_rules["attr-bans"]).to.have.property("severity", "error");
    });
    it('Rules severity should be set as "warning" if "warning" is provided', function () {
      const rule = this.config.getRule("attr-bans");
      const rule_config = {
        "attr-bans": "warning"
      };
      this.config.setRuleConfig(rule, rule_config);
      expect(this.config.activated_rules["attr-bans"]).to.have.property("severity", "warning");
    });
  });
});
