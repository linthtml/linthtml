const { expect } = require("chai");
const Config = require("../../lib/config");
const rules = require("../../lib/rules");
describe("Config", function () {
  // let config = new Config(rules);

  describe("getRule", function () {
    it("Should throw an error when trying to get an unexisting rule", function () {
      const config = new Config();
      expect(() => config.getRule("foo")).to.throw("Rule \"foo\" does not exist.");
    });
    it("Should return existing rules", function () {
      const config = new Config(rules);
      const rule = config.getRule("attr-bans");
      // config.setRuleConfig()

      expect(rule.name).to.equal("attr-bans");
      /* eslint-disable-next-line no-unused-expressions */
      expect(rule.lint).to.not.be.undefined;
    });
  });

  describe("Rule activation", function () {
    this.beforeEach(function () {
      this.config = new Config(rules);
    });
    describe("Boolean config", function () {
      it("Should activate rule if \"true\" is provided", function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": true
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activatedRules).to.have.any.keys("attr-bans");
      });
      it("Should not activate rule if \"false\" is provided", function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": false
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activatedRules).to.not.have.any.keys("attr-bans");
      });
    });
    describe("String config", function () {
      it("Should activate rule if \"error\" is provided", function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": "error"
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activatedRules).to.have.any.keys("attr-bans");
      });
      it("Should activate rule if \"warning\" is provided", function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": "warning"
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activatedRules).to.have.any.keys("attr-bans");
      });
      it("Should not activate rule if \"off\" is provided", function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": "off"
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activatedRules).to.not.have.any.keys("attr-bans");
      });
      it("Should not activate rule if a dummy value is provided", function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": "foo"
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activatedRules).to.not.have.any.keys("attr-bans");
      });
    });
    describe("Object config", function () {
      it("Should not activate rule is a js object is provided", function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": {
            foo: "bar"
          }
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activatedRules).to.not.have.any.keys("attr-bans");
      });
      it("Should not activate rule is an empty array is provided", function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": []
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activatedRules).to.not.have.any.keys("attr-bans");
      });
      it("Should activate rule is first value of array is \"true\" (boolean)", function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": [true]
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activatedRules).to.have.any.keys("attr-bans");
      });

      it("Should not activate rule is first value of array is \"false\" (boolean)", function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": [false]
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activatedRules).to.not.have.any.keys("attr-bans");
      });

      it("Should activate rule is first value of array is \"error\"", function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": ["error"]
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activatedRules).to.have.any.keys("attr-bans");
      });

      it("Should activate rule is first value of array is \"warning\"", function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": ["warning"]
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activatedRules).to.have.any.keys("attr-bans");
      });

      it("Should not activate rule is first value of array is \"off\"", function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": ["off"]
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activatedRules).to.not.have.any.keys("attr-bans");
      });

      it("Should not activate rule is first value of array is a dummy string", function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": ["foo"]
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activatedRules).to.not.have.any.keys("attr-bans");
      });
    });

    describe("Dummy configs", function () {
      // this.beforeEach(function() {
      //   this.config = new Config(rules);
      // });
      it("should not activate rule", function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": [{}]
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activatedRules).to.not.have.any.keys("attr-bans");
      });
      it("should not activate rule", function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": [1]
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activatedRules).to.not.have.any.keys("attr-bans");
      });
      it("should not activate rule", function () {
        const rule = this.config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": 1
        };
        this.config.setRuleConfig(rule, rule_config);
        expect(this.config.activatedRules).to.not.have.any.keys("attr-bans");
      });
    });

    it("Should set rule severity to 'error' by default", function () {
      const rule = this.config.getRule("attr-bans");
      const rule_config = {
        "attr-bans": true
      };
      this.config.setRuleConfig(rule, rule_config);
      expect(this.config.activatedRules["attr-bans"].severity).to.equal("error");
    });

    it("Should set rule severity to 'error' when specified", function () {
      const rule = this.config.getRule("attr-bans");
      const rule_config = {
        "attr-bans": "error"
      };
      this.config.setRuleConfig(rule, rule_config);
      expect(this.config.activatedRules["attr-bans"].severity).to.equal("error");
    });

    it("Should set rule severity to 'warning' when specified", function () {
      const rule = this.config.getRule("attr-bans");
      const rule_config = {
        "attr-bans": "warning"
      };
      this.config.setRuleConfig(rule, rule_config);
      expect(this.config.activatedRules["attr-bans"].severity).to.equal("warning");
    });
  });

  describe("Rules config", function () {
    it("Should not throw and error if no config is provided", function () {
      const config = new Config(rules);
      const rule = config.getRule("attr-bans");
      const rule_config = {
        "attr-bans": [
          "error"
        ]
      };
      expect(() => config.setRuleConfig(rule, rule_config))
        .to
        .not
        .throw();
    });
    describe("Rule validation", function () {
      it("Should call \"validateConfig\" if rule declare the function", function (done) {
        const foo = {
          name: "foo",
          lint () {},
          validateConfig (config) {
            /* eslint-disable-next-line no-unused-expressions */
            expect(config).to.not.be.undefined;
            expect(config.bar).to.equal("bar");
            done();
          }
        };

        const config = new Config({ foo });
        const rule = config.getRule("foo");
        const rule_config = {
          foo: [
            "error",
            {
              bar: "bar"
            }
          ]
        };
        config.setRuleConfig(rule, rule_config);
      });

      it("Should call \"configTransform\" if rule declare the function", function (done) {
        const foo = {
          name: "foo",
          lint () {},
          configTransform (config) {
            return config.bar;
          },
          validateConfig (config) {
            /* eslint-disable-next-line no-unused-expressions */
            expect(config).to.not.be.undefined;
            expect(config).to.equal("bar");
            done();
          }
        };

        const config = new Config({ foo });
        const rule = config.getRule("foo");
        const rule_config = {
          foo: [
            "error",
            {
              bar: "bar"
            }
          ]
        };
        config.setRuleConfig(rule, rule_config);
      });
    });
  });
});
