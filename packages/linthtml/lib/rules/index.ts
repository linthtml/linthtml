// Export an array of all rules.
// @ts-ignore
import bulk from "bulk-require";
import { LegacyRuleDefinition } from "../read-config";

// All modules in this directory excluding this file
// const rulesExport2: Record<string, {default: LegacyRuleDefinition}> = bulk(__dirname, "!(index.ts)");
const rulesExport: Record<
  string,
  { default: LegacyRuleDefinition } & {
    index: { default: LegacyRuleDefinition };
  }
> = bulk(__dirname, ["*/index.{ts,js}", "./dom.{ts,js}", "./free-options.{ts,js}"]);
export default Object.values(rulesExport).map((rule) => rule?.index?.default ?? rule.default);
