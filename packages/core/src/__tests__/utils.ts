import linthtml from "../index.js";
import { presets } from "../presets/index.js";
import type { LegacyLinterConfig, RuleConfig } from "../read-config.js";

export function createLegacyLinter(config: LegacyLinterConfig, preset = presets.none) {
  return new linthtml.LegacyLinter(linthtml.rules, preset, config);
}

export function createLinter(rules: Record<string, RuleConfig>) {
  return linthtml.fromConfig({ rules });
}
