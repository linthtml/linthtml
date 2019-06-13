/* eslint-disable no-console */
const chalk = require('chalk');
const linthtml = require('./index');

function printPosition(issue, maxLine, maxColumn) {
  const line = issue.line.toString();
  const column = issue.column.toString();
  return `${line.padStart(maxLine, " ")}:${column.padEnd(maxColumn, " ")}`;
}

module.exports = function printFileReport(report) {
  // const availableWidth = process.stdout.columns < 80 ? 80 : process.stdout.columns; // find away to divide term in a grid to avoid line breaks

  console.log(chalk`{underline ${report.fileName}}`);
  const maxLine = report.issues.reduce((max, cv) => Math.max(max, cv.line), -1).toString().length;
  const maxColumn = report.issues.reduce((max, cv) => Math.max(max, cv.column), -1).toString().length;

  report.issues.forEach(function (issue) {
    const space = "  ";
    const msg = linthtml.messages.renderIssue(issue);
    const positionTxt = printPosition(issue, maxLine, maxColumn);
    console.log(chalk `  {gray ${positionTxt}}${space}{red ${issue.level}}${space}{white ${msg}}${space}{gray ${issue.rule}}`);
  });
  console.log();
};
/* eslint-enaable no-console */
