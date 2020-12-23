/* eslint-disable no-console */
const chalk = require("chalk");
const messages = require("./messages");
const Table = require("table-layout");

function print_position({ position: { start } }, maxLine, maxColumn) {
  const line = start.line.toString();
  const column = start.column.toString();
  return `${line.padStart(maxLine, " ")}:${column.padEnd(maxColumn, " ")}`;
}

function print_level(issue) {
  return `${{
    warning: "yellow warning",
    error: "red error"
  }[issue.severity]}`;
}

module.exports = function print_file_report(report) {
  console.log(chalk`File: {underline ${report.fileName}}`);
  if (report.config_path) {
    console.log(chalk`{blue Config file: {white.underline ${report.config_path}}}`);
  }
  if (report.preset) {
    console.log(chalk`{blue Using preset: {white ${report.preset}}}`);
  }
  const maxLine = report.issues.reduce((max, cv) => Math.max(max, cv.line), -1).toString().length;
  const maxColumn = report.issues.reduce((max, cv) => Math.max(max, cv.column), -1).toString().length;

  const issues = [];

  report.issues.forEach(function(issue) {
    const msg = messages.renderIssue(issue);
    const positionTxt = print_position(issue, maxLine, maxColumn);
    const level = print_level(issue);
    issues.push({
      positions: chalk`{gray ${positionTxt}}`,
      level: chalk`{${level}}`,
      msg,
      rule: chalk`{gray ${issue.rule}}`
    });
  });

  const table = new Table(issues, { noTrim: true });
  console.log(table.toString());
};
/* eslint-enable no-console */
