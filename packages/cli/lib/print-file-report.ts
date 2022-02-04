import chalk from "chalk";
// @ts-ignore
import Table from "table-layout";
import { renderIssue } from "./messages";
import { Issue, Report } from "./utils";

function print_position({ position: { start } }: Issue, maxLine: number, maxColumn: number) {
  const line = start.line.toString();
  const column = start.column.toString();
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
  console.log(chalk`File: {underline ${report.fileName}}`);
  if (report.config_path) {
    console.log(chalk`{blue Config file: {white.underline ${report.config_path}}}`);
  }
  if (report.preset) {
    console.log(chalk`{blue Using preset: {white ${report.preset}}}`);
  }
  const maxLine = report.issues.reduce((max, cv) => Math.max(max, cv.position.start.line), -1).toString().length;
  const maxColumn = report.issues.reduce((max, cv) => Math.max(max, cv.position.start.column), -1).toString().length;

  type CliIssue = {
    positions: string;
    msg: string;
    level: string;
    rule: string;
  };
  const issues: CliIssue[] = report.issues.map((issue: Issue) => {
    const msg = renderIssue(issue);
    const positionTxt = print_position(issue, maxLine, maxColumn);
    const level = print_level(issue);
    return {
      positions: chalk`{gray ${positionTxt}}`,
      level: chalk`{${level}}`,
      msg,
      rule: chalk`{gray ${issue.rule}}`
    };
  });

  const table = new Table(issues, { noTrim: true });
  console.log(table.toString());
}
