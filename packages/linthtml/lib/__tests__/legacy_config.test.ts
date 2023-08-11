import Config from "../legacy/config";

describe("Legacy Config", () => {
  /* eslint-disable-next-line */
  let testContext: any;

  beforeEach(() => {
    testContext = {};
  });

  beforeEach(() => {
    testContext.config = new Config([]);
    testContext.baseRule = { name: "base" };
    testContext.rule = {
      name: "therule",
      on: "base"
    };
    testContext.option = {
      name: "theoption",
      rules: ["therule"]
    };
  });

  it("should be a function", () => {
    expect(Config).toBeInstanceOf(Function);
  });

  describe("getRule", () => {
    it("should return undefined for nonexistent rule", () => {
      const rule = testContext.config.getRule("nonexistent");

      expect(rule).toBeUndefined();
    });
  });

  describe("initialize", () => {
    it("should initialize rules", () => {
      const config = new Config([testContext.baseRule, testContext.rule]);

      expect(config.getRule(testContext.rule.name)).toEqual(testContext.rule);
      expect(config.getRule(testContext.baseRule.name)).toEqual(testContext.baseRule);
    });

    it("should get options from a rule", () => {
      testContext.rule.options = [testContext.option];
      const config = new Config([testContext.baseRule, testContext.rule]);

      expect(config.options[testContext.option.name]).toEqual(testContext.option);
    });
  });

  describe("addRule", () => {
    it("should add a rule", () => {
      testContext.config.addRule(testContext.rule);

      const addedRule = testContext.config.getRule(testContext.rule.name);

      expect(addedRule).toBe(testContext.rule);
    });

    it("should initialize the rule", () => {
      testContext.config.addRule({ name: "test" });

      const addedRule = testContext.config.getRule("test");

      expect(addedRule.name).toBe("test");
      expect(addedRule.on).toBe("dom");
      expect(addedRule.subscribers).toEqual([]);
    });

    it("should not initialize the same rule twice", () => {
      testContext.config.addRule(testContext.rule);
      testContext.rule.subscribers = ["test"];
      testContext.config.addRule(testContext.rule);
      expect(testContext.rule.subscribers).toEqual(["test"]);
    });

    it("should remove a previous rule", () => {
      const oldRule = {
        name: testContext.rule.name
      };

      testContext.config.addRule(oldRule);
      testContext.config.addRule(testContext.rule);

      const addedRule = testContext.config.getRule(testContext.rule.name);

      expect(addedRule).toBe(testContext.rule);
    });

    it("should remove a previous rule's subcriptions", () => {
      testContext.config.addRule(testContext.baseRule);
      testContext.config.addRule(testContext.rule);
      testContext.config.addOption(testContext.option);
      testContext.config.setOption(testContext.option.name, true);

      const newRule = {
        name: testContext.rule.name,
        subscribers: []
      };
      testContext.config.addRule(newRule);

      expect(newRule.subscribers).toEqual([testContext.option]);
      expect(testContext.baseRule.subscribers).toEqual([]);
    });
  });

  describe("removeRule", () => {
    it("should remove a rule", () => {
      testContext.config.addRule(testContext.rule);
      testContext.config.removeRule(testContext.rule.name);

      const addedRule = testContext.config.getRule(testContext.rule.name);

      expect(addedRule).toBeUndefined();
    });

    it("should not throw when removing a nonregistered rule", () => {
      testContext.config.removeRule("nonexistent");
    });
  });

  describe("addOption", () => {
    it("should add an option", () => {
      testContext.config.addOption(testContext.option);

      const addedOption = testContext.config.options[testContext.option.name];

      expect(addedOption).toBe(testContext.option);
    });

    it("should initialize the option", () => {
      testContext.config.addOption({ name: "test" });

      const addedOption = testContext.config.options.test;

      expect(addedOption.name).toEqual("test");
      expect(addedOption.rules).toEqual(["test"]);
    });

    it("should not initialize the same option twice", () => {
      testContext.config.addOption(testContext.option);
      testContext.option.active = true;
      testContext.config.addOption(testContext.option);
      expect(testContext.option.active).toEqual(true);
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

  describe("removeOption", () => {
    it("should remove the option", () => {
      testContext.config.addOption(testContext.option);
      testContext.config.removeOption(testContext.option.name);

      expect(testContext.config.options[testContext.option.name]).toBeUndefined();
    });

    it("should remove the option's subcriptions", () => {
      testContext.config.addRule(testContext.baseRule);
      testContext.config.addRule(testContext.rule);
      testContext.config.addOption(testContext.option);
      testContext.config.setOption(testContext.option.name, true);
      testContext.config.removeOption(testContext.option.name);
      expect(testContext.rule.subscribers).toEqual([]);
      expect(testContext.baseRule.subscribers).toEqual([]);
    });

    it("should not fail on nonexistent option", () => {
      testContext.config.removeOption("nonexistent");
    });
  });
});
