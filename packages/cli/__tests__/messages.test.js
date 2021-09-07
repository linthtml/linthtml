const { expect } = require("chai");
const messages = require("../lib/messages");

describe("messages", function() {
  describe("renderMsg", function() {
    it("should return a string", function() {
      const code = "E000";
      const data = {};

      const output = messages.renderMsg(code, data);

      expect(output).to.be.eql("not a valid error code");
    });
  });

  describe("renderIssue", function() {
    it("should return a string", function() {
      const issue = { code: "E000", data: {} };

      const output = messages.renderIssue(issue);

      expect(output).to.be.eql("not a valid error code");
    });
  });
});
