import {
  create_string_or_regexp_validator,
  create_list_value_validator,
  create_number_validator,
  is_boolean
} from "../validate_option";

describe("Rules config validators", () => {
  describe("String|Regexp validator", () => {
    it("create a validation function", () => {
      const fn = create_string_or_regexp_validator("foo");
      expect(fn).toBeInstanceOf(Function);
    });
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    [1, () => {}, [], {}, null, undefined, true].forEach((_) => {
      it(
        "validation fn throw an error if a string or a regexp is not provided in input",
        () => {
          const fn = create_string_or_regexp_validator("foo");
          expect(() => fn(_)).toThrow(
            `Configuration for rule "foo" is invalid: Expected string or RegExp got ${typeof _}.`
          );
        }
      );
    });

    ["", /a/].forEach((_) => {
      it(
        "validation fn does not throw an error if a string or a regexp is provided in input",
        () => {
          const fn = create_string_or_regexp_validator("foo");
          expect(() => fn(_)).not.toThrow();
        }
      );
    });

    it("return the provided config in input if config is valid", () => {
      const fn = create_string_or_regexp_validator("foo");
      const input = "foo";
      expect(fn(input)).toBe(input);
    });

    it("can create a validator that does not allow empty string value", () => {
      const fn = create_string_or_regexp_validator("foo", false);
      expect(() => fn("")).toThrow(
        'Configuration for rule "foo" is invalid: You provide an empty string value.'
      );
    });
  });

  describe("Numbers validator", () => {
    it("create a validation function", () => {
      const fn = create_number_validator("foo");
      expect(fn).toBeInstanceOf(Function);
    });
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    ["foo", /a/, () => {}, [], {}, null, undefined, true].forEach((_) => {
      it(
        "validation fn throw an error if a number is not provided in input",
        () => {
          const fn = create_number_validator("foo");
          expect(() => fn(_)).toThrow(
            `Configuration for rule "foo" is invalid: Expected number got ${typeof _}.`
          );
        }
      );
    });

    [1, -1].forEach((_) => {
      it(
        "validation fn does not throw an error if a number is provided in input",
        () => {
          const fn = create_number_validator("foo");
          expect(() => fn(_)).not.toThrow();
        }
      );
    });

    it("return the provided config in input if config is valid", () => {
      const fn = create_number_validator("foo");
      const input = 1;
      expect(fn(input)).toBe(input);
    });

    it("can create a validator that does not negative numbers", () => {
      const fn = create_number_validator("foo", false);
      expect(() => fn(-1)).toThrow(
        'Configuration for rule "foo" is invalid: Only positive indent value are allowed.'
      );
    });
  });

  describe("String list validators", () => {
    it(
      "create validator function throw an error if nothing is provide in input",
      () => {
        // @ts-expect-error Testing rule validation
        expect(() => create_list_value_validator("foo")).toThrow("You must provide a array of string");
      }
    );

    it(
      "create validator function throw an error if not provided with an array of string",
      () => {
        // @ts-expect-error Testing rule validation
        expect(() => create_list_value_validator("foo", ["foo", 1])).toThrow("You must provide a array of string");
      }
    );
    it("create a validation function", () => {
      const fn = create_list_value_validator("foo", []);
      expect(fn).toBeInstanceOf(Function);
    });
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    [1, () => {}, [], {}, null, undefined, true].forEach((_) => {
      it(
        "validation fn throw an error if a string or a regexp is not provided in input",
        () => {
          const fn = create_list_value_validator("foo", []);
          expect(() => fn(_)).toThrow(
            `Configuration for rule "foo" is invalid: Expected string or RegExp got ${typeof _}.`
          );
        }
      );
    });

    ["", /a/].forEach((_) => {
      it(
        "validation fn does not throw an error if a string or a regexp is provided in input",
        () => {
          const fn = create_list_value_validator("foo", [""]);
          expect(() => fn(_)).not.toThrow();
        }
      );
    });

    it("return the provided config in input if config is valid", () => {
      const fn = create_list_value_validator("foo", ["foo"]);
      const input = "foo";
      expect(fn(input)).toBe(input);
    });

    it("throw an error is string provided is not allowed", () => {
      const fn = create_list_value_validator("foo", ["foo"]);
      const input = "bar";
      expect(() => fn(input)).toThrow(
        'Configuration for rule "foo" is invalid: "bar" is not accepted. Accepted value is foo'
      );
    });

    it("can create a validator that does not allow regexp", () => {
      const fn = create_list_value_validator("foo", [], false);
      expect(() => fn(/a/)).toThrow('Configuration for rule "foo" is invalid: Expected string got object.');
    });
  });

  describe("Boolean validator", () => {
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    [1, () => {}, [], {}, null, undefined, "", /a/].forEach((_) => {
      it(
        "validation fn throw an error if a boolean is not provided in input",
        () => {
          expect(() => is_boolean("foo")(_)).toThrow(
            `Configuration for rule "foo" is invalid: Expected boolean got ${typeof _}.`
          );
        }
      );
    });

    it("return the provided config in input if config is valid", () => {
      const input = true;
      expect(is_boolean("foo")(input)).toBe(input);
    });
  });
});
