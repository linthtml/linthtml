import { expect } from "chai";
import {
  create_string_or_regexp_validator,
  create_list_value_validator,
  create_number_validator,
  create_object_validator,
  is_boolean
} from "../validate_option.js";

describe("Rules config validators", function () {
  describe("String|Regexp validator", function () {
    it("create a validation function", function () {
      const fn = create_string_or_regexp_validator("foo");
      expect(fn).to.be.an.instanceOf(Function);
    });
    [
      { config: 1, expected_type: "number" },
      { config: () => {}, expected_type: "function" },
      { config: [], expected_type: "array" },
      { config: {}, expected_type: "object" },
      { config: null, expected_type: "null" },
      { config: undefined, expected_type: "undefined" },
      { config: true, expected_type: "boolean" }
    ].forEach(({ config, expected_type }) => {
      it("validation fn throw an error if a string or a regexp is not provided in input", function () {
        const fn = create_string_or_regexp_validator("foo");
        expect(() => fn(config)).to.throw(
          `Configuration for rule "foo" is invalid: Expected string or RegExp got ${expected_type}.`
        );
      });
    });

    ["", /a/].forEach((_) => {
      it("validation fn does not throw an error if a string or a regexp is provided in input", function () {
        const fn = create_string_or_regexp_validator("foo");
        expect(() => fn(_)).to.not.throw();
      });
    });

    it("return the provided config in input if config is valid", function () {
      const fn = create_string_or_regexp_validator("foo");
      const input = "foo";
      expect(fn(input)).to.equal(input);
    });

    it("can create a validator that does not allow empty string value", function () {
      const fn = create_string_or_regexp_validator("foo", false);
      expect(() => fn("")).to.throw('Configuration for rule "foo" is invalid: You provide an empty string value.');
    });
  });

  describe("Numbers validator", function () {
    it("create a validation function", function () {
      const fn = create_number_validator("foo");
      expect(fn).to.be.an.instanceOf(Function);
    });
    [
      { config: "foo", expected_type: "string" },
      { config: /a/, expected_type: "regexp" },
      { config: () => {}, expected_type: "function" },
      { config: [], expected_type: "array" },
      { config: {}, expected_type: "object" },
      { config: null, expected_type: "null" },
      { config: undefined, expected_type: "undefined" },
      { config: true, expected_type: "boolean" }
    ].forEach(({ config, expected_type }) => {
      it("validation fn throw an error if a number is not provided in input", function () {
        const fn = create_number_validator("foo");
        expect(() => fn(config)).to.throw(
          `Configuration for rule "foo" is invalid: Expected number got ${expected_type}.`
        );
      });
    });

    [1, -1].forEach((_) => {
      it("validation fn does not throw an error if a number is provided in input", function () {
        const fn = create_number_validator("foo");
        expect(() => fn(_)).to.not.throw();
      });
    });

    it("return the provided config in input if config is valid", function () {
      const fn = create_number_validator("foo");
      const input = 1;
      expect(fn(input)).to.equal(input);
    });

    it("can create a validator that does not negative numbers", function () {
      const fn = create_number_validator("foo", false);
      expect(() => fn(-1)).to.throw('Configuration for rule "foo" is invalid: Only positive indent value are allowed.');
    });
  });

  describe("String list validators", function () {
    it("create validator function throw an error if nothing is provide in input", function () {
      // @ts-expect-error Testing rule validation
      expect(() => create_list_value_validator("foo")).to.throw("You must provide a array of string");
    });

    it("create validator function throw an error if not provided with an array of string", function () {
      // @ts-expect-error Testing rule validation
      expect(() => create_list_value_validator("foo", ["foo", 1])).to.throw("You must provide a array of string");
    });
    it("create a validation function", function () {
      const fn = create_list_value_validator("foo", []);
      expect(fn).to.be.an.instanceOf(Function);
    });
    [
      { config: 1, expected_type: "number" },
      { config: () => {}, expected_type: "function" },
      { config: [], expected_type: "array" },
      { config: {}, expected_type: "object" },
      { config: null, expected_type: "null" },
      { config: undefined, expected_type: "undefined" },
      { config: true, expected_type: "boolean" }
    ].forEach((_) => {
      it("validation fn throw an error if a string or a regexp is not provided in input", function () {
        const fn = create_list_value_validator("foo", []);
        expect(() => fn(_)).to.throw(
          `Configuration for rule "foo" is invalid: Expected string or RegExp got ${typeof _}.`
        );
      });
    });

    ["", /a/].forEach((_) => {
      it("validation fn does not throw an error if a string or a regexp is provided in input", function () {
        const fn = create_list_value_validator("foo", [""]);
        expect(() => fn(_)).to.not.throw();
      });
    });

    it("return the provided config in input if config is valid", function () {
      const fn = create_list_value_validator("foo", ["foo"]);
      const input = "foo";
      expect(fn(input)).to.equal(input);
    });

    it("throw an error is string provided is not allowed", function () {
      const fn = create_list_value_validator("foo", ["foo"]);
      const input = "bar";
      expect(() => fn(input)).to.throw(
        'Configuration for rule "foo" is invalid: "bar" is not accepted. Accepted value is foo'
      );
    });

    it("can create a validator that does not allow regexp", function () {
      const fn = create_list_value_validator("foo", [], false);
      expect(() => fn(/a/)).to.throw('Configuration for rule "foo" is invalid: Expected string got regexp.');
    });
  });

  describe("Boolean validator", function () {
    [
      { config: 1, expected_type: "number" },
      { config: () => {}, expected_type: "function" },
      { config: [], expected_type: "array" },
      { config: {}, expected_type: "object" },
      { config: null, expected_type: "null" },
      { config: undefined, expected_type: "undefined" },
      { config: "", expected_type: "string" },
      { config: /a/, expected_type: "regexp" }
    ].forEach(({ config, expected_type }) => {
      it("validation fn throw an error if a boolean is not provided in input", function () {
        expect(() => is_boolean("foo")(config)).to.throw(
          `Configuration for rule "foo" is invalid: Expected boolean got ${expected_type}.`
        );
      });
    });

    it("return the provided config in input if config is valid", function () {
      const input = true;
      expect(is_boolean("foo")(input)).to.equal(input);
    });
  });

  describe("Object validator", function () {
    [
      { config: 1, expected_type: "number" },
      { config: true, expected_type: "boolean" },
      { config: [], expected_type: "array" },
      { config: () => {}, expected_type: "function" },
      { config: null, expected_type: "null" },
      { config: undefined, expected_type: "undefined" },
      { config: "", expected_type: "string" },
      { config: /a/, expected_type: "regexp" }
    ].forEach(({ config, expected_type }) => {
      it("validation fn throw an error if an object is not provided in input", function () {
        expect(() => create_object_validator("foo", [])(config)).to.throw(
          `Configuration for rule "foo" is invalid: Expected object got ${expected_type}.`
        );
      });
    });
  });

  it("Should throw an error if provided object contain other keys than 'required' ones", function () {
    expect(() => create_object_validator("foo", ["fizz"])({ foo: "bar" })).to.throw(
      `Object configuration for rule "foo" is invalid: key "foo" is not accepted, only "fizz" is.`
    );
  });
});
