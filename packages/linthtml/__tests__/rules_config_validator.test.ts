import { expect } from "chai";
import {
  create_string_or_regexp_validator,
  create_list_value_validator,
  create_number_validator,
  is_boolean
} from "../lib/validate_option";

describe("Rules config validators", function () {
  describe("String|Regexp validator", function () {
    it("create a validation function", function () {
      const fn = create_string_or_regexp_validator("foo");
      expect(fn).to.be.an.instanceOf(Function);
    });
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    [1, () => {}, [], {}, null, undefined, true].forEach((_) => {
      it("validation fn throw an error if a string or a regexp is not provided in input", function () {
        const fn = create_string_or_regexp_validator("foo");
        expect(() => fn(_)).to.throw(
          `Configuration for rule "foo" is invalid: Expected string or RegExp got ${typeof _}.`
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
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    ["foo", /a/, () => {}, [], {}, null, undefined, true].forEach((_) => {
      it("validation fn throw an error if a number is not provided in input", function () {
        const fn = create_number_validator("foo");
        expect(() => fn(_)).to.throw(`Configuration for rule "foo" is invalid: Expected number got ${typeof _}.`);
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
      // @ts-ignore
      expect(() => create_list_value_validator("foo")).to.throw("You must provide a array of string");
    });

    it("create validator function throw an error if not provided with an array of string", function () {
      // @ts-ignore
      expect(() => create_list_value_validator("foo", ["foo", 1])).to.throw("You must provide a array of string");
    });
    it("create a validation function", function () {
      const fn = create_list_value_validator("foo", []);
      expect(fn).to.be.an.instanceOf(Function);
    });
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    [1, () => {}, [], {}, null, undefined, true].forEach((_) => {
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
      expect(() => fn(/a/)).to.throw('Configuration for rule "foo" is invalid: Expected string got object.');
    });
  });

  describe("Boolean validator", function () {
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    [1, () => {}, [], {}, null, undefined, "", /a/].forEach((_) => {
      it("validation fn throw an error if a boolean is not provided in input", function () {
        expect(() => is_boolean("foo")(_)).to.throw(
          `Configuration for rule "foo" is invalid: Expected boolean got ${typeof _}.`
        );
      });
    });

    it("return the provided config in input if config is valid", function () {
      const input = true;
      expect(is_boolean("foo")(input)).to.equal(input);
    });
  });
});
