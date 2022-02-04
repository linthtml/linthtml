import { types } from "util";

const { isRegExp } = types;

const formats: any = {
  lowercase: /^[a-z\d]+$/,
  underscore: /^[a-z\d]+(_[a-z\d]+)*$/,
  dash: /^[a-z\d]+(-[a-z\d]+)*$/,
  camel: /^[a-zA-Z\d]*$/,
  bem: /^[a-z][a-z\d]*(-[a-z\d]+)*(__[a-z\d]+(-[a-z\d]+)*)?(--[a-z\d]+(-[a-z\d]+)*)?$/
};

function getRegExp(val: string | RegExp): RegExp {
  if (isRegExp(val)) {
    return val;
  }
  return formats[val] || new RegExp(`^${val}$`, "gm");
}

export default function (format: string | RegExp, value: string): boolean {
  // return error is provided format does not exist
  const R = getRegExp(format);
  return R.test(value);
}
