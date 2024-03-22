// Export an array of all rules.
import path from "path";
import { fileURLToPath } from "url";
import type { LegacyRuleDefinition } from "../read-config.js";
import { globbySync } from "globby";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rules_path = globbySync(["*/index.{ts,js}", "./dom.{ts,js}", "./free-options.{ts,js}"], {
  cwd: __dirname,
  absolute: true
});

const rulesExport = await Promise.all(rules_path.map((path) => import(path)));

export default Object.values(rulesExport).map((rule) => rule?.index?.default ?? rule.default) as LegacyRuleDefinition[];
