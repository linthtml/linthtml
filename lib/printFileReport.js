/* eslint-disable no-console */
const chalk = require("chalk");
const messages = require("./messages");
const Table = require("table-layout");

function printPosition(issue, maxLine, maxColumn) {
  const line = issue.line.toString();
  const column = issue.column.toString();
  return `${line.padStart(maxLine, " ")}:${column.padEnd(maxColumn, " ")}`;
}
function printLevel(issue) {
  return `${{
    warning: "yellow warning",
    error: "red error"
  }[issue.severity]}`;
}

module.exports = function printFileReport(report) {
  console.log(chalk`{underline ${report.fileName}}`);
  const maxLine = report.issues.reduce((max, cv) => Math.max(max, cv.line), -1).toString().length;
  const maxColumn = report.issues.reduce((max, cv) => Math.max(max, cv.column), -1).toString().length;

  const issues = [];

  report.issues.forEach(function(issue) {
    const msg = messages.renderIssue(issue);
    const positionTxt = printPosition(issue, maxLine, maxColumn);
    const level = printLevel(issue);
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
/* eslint-enaable no-console */
