import { expect } from "chai";
// TODO: Remove .default after typescript migration
import Config from "../lib/legacy/config";

describe("Legacy Config", function () {
  beforeEach(function () {
    this.config = new Config([]);
    this.baseRule = { name: "base" };
    this.rule = {
      name: "therule",
      on: "base"
    };
    this.option = {
      name: "theoption",
      rules: ["therule"]
    };
  });

  it("should be a function", function () {
    expect(Config).to.be.an.instanceOf(Function);
  });

  describe("getRule", function () {
    it("should return undefined for nonexistent rule", function () {
      const rule = this.config.getRule("nonexistent");

      expect(rule).to.be.a("undefined");
    });
  });

  describe("initialize", function () {
    it("should initialize rules", function () {
      const config = new Config([this.baseRule, this.rule]);

      expect(config.getRule(this.rule.name)).to.be.eql(this.rule);
      expect(config.getRule(this.baseRule.name)).to.be.eql(this.baseRule);
    });

    it("should get options from a rule", function () {
      this.rule.options = [this.option];
      const config = new Config([this.baseRule, this.rule]);

      expect(config.options[this.option.name]).to.be.eql(this.option);
    });
  });

  describe("addRule", function () {
    it("should add a rule", function () {
      this.config.addRule(this.rule);

      const addedRule = this.config.getRule(this.rule.name);

      expect(addedRule).to.be.equal(this.rule);
    });

    it("should initialize the rule", function () {
      this.config.addRule({ name: "test" });

      const addedRule = this.config.getRule("test");

      expect(addedRule.name).to.equal("test");
      expect(addedRule.on).to.equal("dom", "Default value for 'on' should be 'dom'");
      expect(addedRule.subscribers).to.deep.equal([]);
    });

    it("should not initialize the same rule twice", function () {
      this.config.addRule(this.rule);
      this.rule.subscribers = ["test"];
      this.config.addRule(this.rule);
      expect(this.rule.subscribers).to.be.eql(["test"]);
    });

    it("should remove a previous rule", function () {
      const oldRule = {
        name: this.rule.name
      };

      this.config.addRule(oldRule);
      this.config.addRule(this.rule);

      const addedRule = this.config.getRule(this.rule.name);

      expect(addedRule).to.be.equal(this.rule);
    });

    it("should remove a previous rule's subcriptions", function () {
      this.config.addRule(this.baseRule);
      this.config.addRule(this.rule);
      this.config.addOption(this.option);
      this.config.setOption(this.option.name, true);

      const newRule = {
        name: this.rule.name,
        subscribers: []
      };
      this.config.addRule(newRule);

      expect(newRule.subscribers).to.be.eql([this.option]);
      expect(this.baseRule.subscribers).to.be.eql([]);
    });
  });

  describe("removeRule", function () {
    it("should remove a rule", function () {
      this.config.addRule(this.rule);
      this.config.removeRule(this.rule.name);

      const addedRule = this.config.getRule(this.rule.name);

      expect(addedRule).to.be.a("undefined");
    });

    it("should not throw when removing a nonregistered rule", function () {
      this.config.removeRule("nonexistent");
    });
  });

  describe("addOption", function () {
    it("should add an option", function () {
      this.config.addOption(this.option);

      const addedOption = this.config.options[this.option.name];

      expect(addedOption).to.be.equal(this.option);
    });

    it("should initialize the option", function () {
      this.config.addOption({ name: "test" });

      const addedOption = this.config.options.test;

      expect(addedOption.name).to.be.eql("test");
      expect(addedOption.rules).to.be.eql(["test"]);
    });

    it("should not initialize the same option twice", function () {
      this.config.addOption(this.option);
      this.option.active = true;
      this.config.addOption(this.option);
      expect(this.option.active).to.be.eql(true);
    });

    // No longer working because rules can only subscribe to the "dom" rule
    // it("should maintain active and update subscriptions", function() {
    //   config.addRule(baseRule);
    //   config.addRule(rule);
    //   const option2 = {
    //     name: option.name,
    //     rules: [baseRule.name]
    //   };
    //   config.addOption(option2);
    //   config.setOption(option.name, true);

    //   config.addOption(option);
    //   expect(option.active).to.be.eql(true);
    //   expect(baseRule.subscribers).to.be.eql([rule]);
    //   expect(rule.subscribers).to.be.eql([option]);

    //   config.addOption(option2);
    //   expect(option2.active).to.be.eql(true);
    //   expect(baseRule.subscribers).to.be.eql([option2]);
    //   expect(rule.subscribers).to.be.eql([]);
    // });
  });

  // No longer working because rules can only subscribe to the "dom" rule
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

  //     const option2 = {
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

  describe("removeOption", function () {
    it("should remove the option", function () {
      this.config.addOption(this.option);
      this.config.removeOption(this.option.name);

      expect(this.config.options[this.option.name]).to.be.undefined;
    });

    it("should remove the option's subcriptions", function () {
      this.config.addRule(this.baseRule);
      this.config.addRule(this.rule);
      this.config.addOption(this.option);
      this.config.setOption(this.option.name, true);
      this.config.removeOption(this.option.name);
      expect(this.rule.subscribers).to.be.eql([]);
      expect(this.baseRule.subscribers).to.be.eql([]);
    });

    it("should not fail on nonexistent option", function () {
      this.config.removeOption("nonexistent");
    });
  });
});
