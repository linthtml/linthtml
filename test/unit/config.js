const { expect } = require("chai");
const Config = require("../../lib/config");
const rules = require("../../lib/rules");
describe("Config", function() {
  // let config = new Config(rules);
  
  describe("getRule", function() {
    it("Should throw an error when trying to get an unexisting rule", function() {
      const config = new Config();
      expect(() => config.getRule("foo")).to.throw("Rule \"foo\" does not exist.");
    });
    it("Should return existing rules", function() {
      const config = new Config(rules);
      const rule = config.getRule("attr-bans");
      // config.setRuleConfig()
      
      expect(rule.name).to.equal("attr-bans");
      expect(rule.lint).to.not.be.undefined;
    });
  });

  describe("Rule activation", function() {
    this.beforeEach(function () {
      this.config = new Config(rules);
    });
    describe("Boolean config", function() {

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
            "foo": "bar"
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
  });

        const config = new Config(rules);
        const rule = config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": [{}]
        };
        config.setRuleConfig(rule, rule_config);
        expect(config.activatedRules).to.not.have.any.keys("attr-bans");
      });
      it("should not activate rule", function() {
        const config = new Config(rules);
        const rule = config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": [1]
        };
        config.setRuleConfig(rule, rule_config);
        expect(config.activatedRules).to.not.have.any.keys("attr-bans");
      });
      it("should not activate rule", function() {
        const config = new Config(rules);
        const rule = config.getRule("attr-bans");
        const rule_config = {
          "attr-bans": 1
        };
        config.setRuleConfig(rule, rule_config);
        expect(config.activatedRules).to.not.have.any.keys("attr-bans");
      });
    });
  });

  // describe("initialize", function() {
  //   it("should initialize rules", function() {
  //     config = new Config([baseRule, rule]);

  //     expect(config.getRule(rule.name)).to.be.eql(rule);
  //     expect(config.getRule(baseRule.name)).to.be.eql(baseRule);
  //   });

  //   it("should initialize both rules and options", function() {
  //     config = new Config([baseRule, rule], [option]);

  //     expect(config.getRule(rule.name)).to.be.eql(rule);
  //     expect(config.getRule(baseRule.name)).to.be.eql(baseRule);
  //     expect(config.options[option.name]).to.be.eql(option);
  //   });

  //   it("should get options from a rule", function() {
  //     rule.options = [option];
  //     config = new Config([baseRule, rule]);

  //     expect(config.options[option.name]).to.be.eql(option);
  //   });
  // });

  // describe("addRule", function() {
  //   it("should add a rule", function() {
  //     config.addRule(rule);

  //     var addedRule = config.getRule(rule.name);

  //     expect(addedRule).to.be.equal(rule);
  //   });

  //   it("should initialize the rule", function() {
  //     config.addRule({ name: "test" });

  //     var addedRule = config.getRule("test");

  //     expect(addedRule.name).to.be.eql("test");
  //     expect(addedRule.on).to.be.eql([]);
  //     expect(addedRule.subscribers).to.be.eql([]);
  //   });

  //   it("should not initialize the same rule twice", function() {
  //     config.addRule(rule);
  //     rule.subscribers = ["test"];
  //     config.addRule(rule);
  //     expect(rule.subscribers).to.be.eql(["test"]);
  //   });

  //   it("should remove a previous rule", function() {
  //     var oldRule = {};
  //     oldRule.name = rule.name;

  //     config.addRule(oldRule);
  //     config.addRule(rule);

  //     var addedRule = config.getRule(rule.name);

  //     expect(addedRule).to.be.equal(rule);
  //   });

  //   it("should remove a previous rule's subcriptions", function() {
  //     config.addRule(baseRule);
  //     config.addRule(rule);
  //     config.addOption(option);
  //     config.setOption(option.name, true);

  //     var newRule = { name: rule.name, on: [] };
  //     config.addRule(newRule);

  //     expect(newRule.subscribers).to.be.eql([option]);
  //     expect(baseRule.subscribers).to.be.eql([]);
  //   });
  // });

  // describe("removeRule", function() {
  //   it("should remove a rule", function() {
  //     config.addRule(rule);
  //     config.removeRule(rule.name);

  //     var addedRule = config.getRule(rule.name);

  //     expect(addedRule).to.be.a("undefined");
  //   });

  //   it("should not throw when removing a nonregistered rule", function() {
  //     config.removeRule("nonexistent");
  //   });
  // });

  // describe("addOption", function() {
  //   it("should add an option", function() {
  //     config.addOption(option);

  //     var addedOption = config.options[option.name];

  //     expect(addedOption).to.be.equal(option);
  //   });

  //   it("should initialize the option", function() {
  //     config.addOption({ name: "test" });

  //     var addedOption = config.options.test;

  //     expect(addedOption.name).to.be.eql("test");
  //     expect(addedOption.rules).to.be.eql(["test"]);
  //   });

  //   it("should not initialize the same option twice", function() {
  //     config.addOption(option);
  //     option.active = true;
  //     config.addOption(option);
  //     expect(option.active).to.be.eql(true);
  //   });

  //   it("should maintain active and update subscriptions", function() {
  //     config.addRule(baseRule);
  //     config.addRule(rule);
  //     var option2 = {
  //       name: option.name,
  //       rules: [baseRule.name]
  //     };
  //     config.addOption(option2);
  //     config.setOption(option.name, true);

  //     config.addOption(option);
  //     expect(option.active).to.be.eql(true);
  //     expect(baseRule.subscribers).to.be.eql([rule]);
  //     expect(rule.subscribers).to.be.eql([option]);

  //     config.addOption(option2);
  //     expect(option2.active).to.be.eql(true);
  //     expect(baseRule.subscribers).to.be.eql([option2]);
  //     expect(rule.subscribers).to.be.eql([]);
  //   });
  // });

  // describe("setOption", function() {
  //   it("should subscribe and unsubscribe the rule", function() {
  //     config.addRule(baseRule);
  //     config.addRule(rule);
  //     config.addOption(option);

  //     config.setOption(option.name, true);
  //     expect(rule.subscribers).to.be.eql([option]);
  //     expect(baseRule.subscribers).to.be.eql([rule]);

  //     config.setOption(option.name, false);
  //     expect(rule.subscribers).to.be.eql([]);
  //     expect(baseRule.subscribers).to.be.eql([]);

  //     var option2 = {
  //       name: "option2",
  //       rules: option.rules
  //     };
  //     config.addOption(option2);
  //     config.setOption(option.name, true);
  //     config.setOption(option2.name, true);
  //     config.setOption(option.name, false);
  //     expect(rule.subscribers).to.be.eql([option2]);
  //     expect(baseRule.subscribers).to.be.eql([rule]);

  //     config.setOption(option2.name, false);
  //     expect(rule.subscribers).to.be.eql([]);
  //     expect(baseRule.subscribers).to.be.eql([]);
  //   });
  // });

  // describe("removeOption", function() {
  //   it("should remove the option", function() {
  //     config.addOption(option);
  //     config.removeOption(option.name);
  //     expect(config.options[option.name]).to.be.undefined;
  //   });

  //   it("should remove the option's subcriptions", function() {
  //     config.addRule(baseRule);
  //     config.addRule(rule);
  //     config.addOption(option);
  //     config.setOption(option.name, true);
  //     config.removeOption(option.name);
  //     expect(rule.subscribers).to.be.eql([]);
  //     expect(baseRule.subscribers).to.be.eql([]);
  //   });

  //   it("should not fail on nonexistent option", function() {
  //     config.removeOption("nonexistent");
  //   });
  // });
});
