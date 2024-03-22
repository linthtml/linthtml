import { expect } from "chai";
import Config from "../legacy/config.js";

describe("Legacy Config", function () {
  const baseRule = { name: "base", lint: () => {} } as const;

  const rule = {
    name: "therule",
    on: "base",
    lint: () => {}
  };

  const option = {
    name: "theoption",
    rules: ["therule"]
  };

  let config: Config;

  beforeEach(function () {
    config = new Config([]);
  });

  it("should be a function", function () {
    expect(Config).to.be.an.instanceOf(Function);
  });

  describe("getRule", function () {
    it("should return undefined for nonexistent rule", function () {
      const rule = config.getRule("nonexistent");

      expect(rule).to.be.a("undefined");
    });
  });

  describe("initialize", function () {
    it("should initialize rules", function () {
      const config = new Config([baseRule, rule]);

      expect(config.getRule(rule.name)).to.be.eql(rule);
      expect(config.getRule(baseRule.name)).to.be.eql(baseRule);
    });

    it("should get options from a rule", function () {
      const my_rule = {
        ...rule,
        options: [option]
      };

      const config = new Config([baseRule, my_rule]);

      expect(config.options[option.name]).to.be.eql(option);
    });
  });

  describe("addRule", function () {
    it("should add a rule", function () {
      config.addRule(rule);

      const addedRule = config.getRule(rule.name);

      expect(addedRule).to.be.equal(rule);
    });

    it("should initialize the rule", function () {
      config.addRule({ name: "test", lint: () => {} });

      const addedRule = config.getRule("test");

      expect(addedRule.name).to.equal("test");
      expect(addedRule.on).to.equal("dom", "Default value for 'on' should be 'dom'");
      expect(addedRule.subscribers).to.deep.equal([]);
    });

    it("should not initialize the same rule twice", function () {
      const my_rule = { ...rule };
      config.addRule(my_rule);
      // @ts-expect-error Permitted by the API
      my_rule.subscribers = ["test"];
      config.addRule(rule);
      // @ts-expect-error Permitted by the API
      expect(my_rule.subscribers).to.be.eql(["test"]);
    });

    it("should remove a previous rule", function () {
      const oldRule = {
        name: rule.name,
        lint: () => {}
      };

      config.addRule(oldRule);
      config.addRule(rule);

      const addedRule = config.getRule(rule.name);

      expect(addedRule).to.be.equal(rule);
    });

    it("should remove a previous rule's subcriptions", function () {
      config.addRule(baseRule);
      config.addRule(rule);
      config.addOption(option);
      config.setOption(option.name, true);

      const newRule = {
        name: rule.name,
        lint: () => {},
        subscribers: []
      };
      config.addRule(newRule);

      expect(newRule.subscribers).to.be.eql([option]);
      // @ts-expect-error Default value added internally (bad side effect)
      expect(baseRule.subscribers).to.be.eql([]);
    });
  });

  describe("removeRule", function () {
    it("should remove a rule", function () {
      config.addRule(rule);
      config.removeRule(rule.name);

      const addedRule = config.getRule(rule.name);

      expect(addedRule).to.be.a("undefined");
    });

    it("should not throw when removing a nonregistered rule", function () {
      config.removeRule("nonexistent");
    });
  });

  describe("addOption", function () {
    it("should add an option", function () {
      config.addOption(option);

      const addedOption = config.options[option.name];

      expect(addedOption).to.be.equal(option);
    });

    it("should initialize the option", function () {
      config.addOption({ name: "test" });

      const addedOption = config.options.test;

      expect(addedOption.name).to.be.eql("test");
      expect(addedOption.rules).to.be.eql(["test"]);
    });

    it("should not initialize the same option twice", function () {
      config.addOption(option);
      // @ts-expect-error Active set internally (bad side effect)
      option.active = true;
      config.addOption(option);
      // @ts-expect-error Active set internally (bad side effect)
      expect(option.active).to.be.eql(true);
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
      config.addOption(option);
      config.removeOption(option.name);

      expect(config.options[option.name]).to.be.undefined;
    });

    it("should remove the option's subcriptions", function () {
      config.addRule(baseRule);
      config.addRule(rule);
      config.addOption(option);
      config.setOption(option.name, true);
      config.removeOption(option.name);
      // @ts-expect-error subscribers set internally (bad side effect)
      expect(rule.subscribers).to.be.eql([]);
      // @ts-expect-error subscribers set internally (bad side effect)
      expect(baseRule.subscribers).to.be.eql([]);
    });

    it("should not fail on nonexistent option", function () {
      config.removeOption("nonexistent");
    });
  });
});
