import presetsDefault from "./default.js";
import presetsA11y from "./accessibility.js";
import presetsValidate from "./validate.js";
import type { LegacyLinterConfig } from "../read-config.js";

const none = (() => {
  const keys = Object.keys(presetsDefault);
  const obj: LegacyLinterConfig = {};
  keys.forEach((key) => {
    obj[key] = false;
  });
  return obj;
})();

export const presets = {
  none,
  accessibility: presetsA11y,
  validate: presetsValidate,
  default: presetsDefault
};
