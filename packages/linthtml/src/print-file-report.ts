import chalkTemplate from "chalk-template";
// @ts-expect-error No types available
import Table from "table-layout";
import { renderIssue } from "@linthtml/core/messages";
import type { Report } from "./utils.js";
import type { Position } from "@linthtml/dom-utils";
import type Issue from "@linthtml/core/issue";

function print_position(start: Position | undefined, maxLine: number, maxColumn: number) {
  const line = start?.line.toString() ?? "-";
  const column = start?.column.toString() ?? "-";
  return `${line.padStart(maxLine, " ")}:${column.padEnd(maxColumn, " ")}`;
}

function print_level({ severity }: { severity: string }) {
  return `${
    {
      warning: "yellow warning",
      error: "red error"
    }[severity]
  }`;
}

export default function print_file_report(report: Report) {
  console.log(chalkTemplate`File: {underline ${report.fileName}}`);
  if (report.config_path) {
    console.log(chalkTemplate`{blue Config file: {white.underline ${report.config_path}}}`);
  }
  if (report.preset) {
    console.log(chalkTemplate`{blue Using preset: {white ${report.preset}}}`);
  }
  const maxLine = report.issues.reduce((max, cv) => Math.max(max, cv.position?.start?.line || 1), -1).toString().length;
  const maxColumn = report.issues
    .reduce((max, cv) => Math.max(max, cv.position?.start?.column || 1), -1)
    .toString().length;

  type CliIssue = {
    positions: string;
    msg: string;
    level: string;
    rule: string;
  };
  const issues: CliIssue[] = report.issues.map((issue: Issue) => {
    const msg = renderIssue(issue);
    const positionTxt = print_position(issue.position?.start, maxLine, maxColumn);
    const level = print_level(issue);
    return {
      positions: chalkTemplate`{gray ${positionTxt}}`,
      level: chalkTemplate`{${level}}`,
      msg,
      rule: chalkTemplate`{gray ${issue.rule}}`
    };
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const table = new Table(issues, {
    noTrim: true,
    maxWidth: 250
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  console.log(table.toString());
}
