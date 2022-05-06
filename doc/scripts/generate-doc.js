const glob = require("glob");
const fs = require("fs");
const path = require("path");

const outputDir = "./docs";
const rulesOutputDir = `${outputDir}/user-guide/rules/list`;

function main() {
  if (!fs.existsSync(rulesOutputDir)) {
    fs.mkdirSync(rulesOutputDir);
  }
  glob.sync("../README.md").forEach((file) => {
    fs.copyFileSync(file, "./docs/index.md");
  });

  glob.sync("../packages/linthtml/lib/rules/**/*.md").forEach((file) => {
    const outputFile = path.join(
      rulesOutputDir,
      file.replace(/([a-z-\d]+)\/README.md/, "$1.md").replace("../packages/linthtml/lib/rules", "")
    );
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.copyFileSync(file, outputFile);
  });
}

main();
