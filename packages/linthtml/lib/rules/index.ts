// Export an array of all rules.
// @ts-ignore
import bulk from "bulk-require";
import { LegacyRuleDefinition } from "../read-config";

// All modules in this directory excluding this file
const rulesExport: Record<string, {default: LegacyRuleDefinition}> = bulk(__dirname, "!(index.ts)");
export default Object.values(rulesExport).map(rule => rule.default);
