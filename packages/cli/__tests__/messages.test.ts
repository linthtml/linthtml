const { expect } = require("chai");
const messages = require("../lib/messages");

describe("messages", function() {
  describe("renderIssue", function() {
    it("should return a string", function() {
      const issue = { code: "E000", data: {} };

      const output = messages.renderIssue(issue);

      expect(output).to.be.eql("not a valid error code");
    });
  });
});
