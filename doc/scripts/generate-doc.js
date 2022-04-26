const glob = require("glob");
const fs = require("fs");
const path = require("path");

const outputDir = "./docs";
const rulesOutputDir = `${outputDir}/rules`;

function main() {
  if (!fs.existsSync(rulesOutputDir)) {
    fs.mkdirSync(rulesOutputDir);
  }
  glob.sync("../README.md").forEach((file) => {
    const outputFile = path.join(outputDir, file.replace("README.md", "index.md"));
    fs.copyFileSync(file, outputFile);
  });

  glob.sync("../packages/linthtml/lib/rules/**/*.md").forEach((file) => {
    const outputFile = path.join(
      rulesOutputDir,
      file.replace(/\.\.\/([a-z-]+)\/README.md/, "$1.md").replace("packages/linthtml/lib/", "")
    );

    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.copyFileSync(file, outputFile);
  });
}

main();
