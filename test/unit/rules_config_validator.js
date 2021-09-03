const { expect } = require("chai");
const validators = require("../../lib/validate_option");

describe("Rules config validators", function() {
  describe("String|Regexp validator", function() {
    it("create a validation function", function() {
      const fn = validators.create_string_or_regexp_validator();
      expect(fn).to.be.an.instanceOf(Function);
    });
    [1, () => {}, [], {}, null, undefined, true].forEach(_ => {
      it("validation fn throw an error if a string or a regexp is not provided in input", function() {
        const fn = validators.create_string_or_regexp_validator();
        expect(() => fn(_))
          .to
          .throw(`Configuration for rule "undefined" is invalid: Expected string or RegExp got ${typeof _}.`);
      });
    });

    ["", new RegExp()].forEach(_ => {
      it("validation fn does not throw an error if a string or a regexp is provided in input", function() {
        const fn = validators.create_string_or_regexp_validator();
        expect(() => fn(_))
          .to
          .not
          .throw();
      });
    });

    it("return the provided config in input if config is valid", function() {
      const fn = validators.create_string_or_regexp_validator();
      const input = "foo";
      expect(fn(input))
        .to
        .equal(input);
    });

    it("can create a validator that does not allow empty string value", function() {
      const fn = validators.create_string_or_regexp_validator(false);
      expect(() => fn(""))
        .to
        .throw("Configuration for rule \"undefined\" is invalid: You provide an empty string value.");
    });
  });

  describe("Numbers validator", function() {
    it("create a validation function", function() {
      const fn = validators.create_number_validator();
      expect(fn).to.be.an.instanceOf(Function);
    });
    ["foo", new RegExp(), () => {}, [], {}, null, undefined, true].forEach(_ => {
      it("validation fn throw an error if a number is not provided in input", function() {
        const fn = validators.create_number_validator();
        expect(() => fn(_))
          .to
          .throw(`Configuration for rule "undefined" is invalid: Expected number got ${typeof _}.`);
      });
    });

    [1, -1].forEach(_ => {
      it("validation fn does not throw an error if a number is provided in input", function() {
        const fn = validators.create_number_validator();
        expect(() => fn(_))
          .to
          .not
          .throw();
      });
    });

    it("return the provided config in input if config is valid", function() {
      const fn = validators.create_number_validator();
      const input = 1;
      expect(fn(input))
        .to
        .equal(input);
    });

    it("can create a validator that does not negative numbers", function() {
      const fn = validators.create_number_validator(false);
      expect(() => fn(-1))
        .to
        .throw("Configuration for rule \"undefined\" is invalid: Only positive indent value are allowed.");
    });
  });

  describe("String list validators", function() {
    it("create validator function throw an error if nothing is provide in input", function() {
      expect(() => validators.create_list_value_validator())
        .to
        .throw("You must provide a array of string");
    });

    it("create validator function throw an error if not provided with an array of string", function() {
      expect(() => validators.create_list_value_validator(["foo", 1]))
        .to
        .throw("You must provide a array of string");
    });
    it("create a validation function", function() {
      const fn = validators.create_list_value_validator([]);
      expect(fn).to.be.an.instanceOf(Function);
    });
    [1, () => {}, [], {}, null, undefined, true].forEach(_ => {
      it("validation fn throw an error if a string or a regexp is not provided in input", function() {
        const fn = validators.create_list_value_validator([]);
        expect(() => fn(_))
          .to
          .throw(`Configuration for rule "undefined" is invalid: Expected string or RegExp got ${typeof _}.`);
      });
    });

    ["", new RegExp()].forEach(_ => {
      it("validation fn does not throw an error if a string or a regexp is provided in input", function() {
        const fn = validators.create_list_value_validator([""]);
        expect(() => fn(_))
          .to
          .not
          .throw();
      });
    });

    it("return the provided config in input if config is valid", function() {
      const fn = validators.create_list_value_validator(["foo"]);
      const input = "foo";
      expect(fn(input))
        .to
        .equal(input);
    });

    it("throw an error is string provided is not allowed", function() {
      const fn = validators.create_list_value_validator(["foo"]);
      const input = "bar";
      expect(() => fn(input))
        .to
        .throw("Configuration for rule \"undefined\" is invalid: \"bar\" is not accepted. Accepted value is foo");
    });

    it("can create a validator that does not allow empty regexp", function() {
      const fn = validators.create_list_value_validator([], false);
      expect(() => fn(new RegExp()))
        .to
        .throw("Configuration for rule \"undefined\" is invalid: Expected string got object.");
    });
  });

  describe("Boolean validator", function() {
    [1, () => {}, [], {}, null, undefined, "", new RegExp()].forEach(_ => {
      it("validation fn throw an error if a boolean is not provided in input", function() {
        expect(() => validators.is_boolean(_))
          .to
          .throw(`Configuration for rule "undefined" is invalid: Expected boolean got ${typeof _}.`);
      });
    });

    it("return the provided config in input if config is valid", function() {
      const input = true;
      expect(validators.is_boolean(input))
        .to
        .equal(input);
    });
  });
});
