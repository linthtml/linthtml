import presetsDefault from "./default";
import presetsA11y from "./accessibility";
import presetsValidate from "./validate";
import { LegacyLinterConfig } from "../read-config";

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
