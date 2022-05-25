import glob from "glob";
import fs from "fs";
import path from "path";
import { remark } from "remark";
import { visit } from "unist-util-visit";

const outputDir = "./docs";
const rulesOutputDir = `${outputDir}/user-guide/rules/list`;

function rewriteLink(options) {
  function visitor(node) {
    node.url = options.rewriter(node.url);
  }

  function transform(tree) {
    visit(tree, ["link"], visitor);
  }

  return transform;
}

function main() {
  if (!fs.existsSync(rulesOutputDir)) {
    fs.mkdirSync(rulesOutputDir);
  }
  glob.sync("../README.md").forEach((file) => {
    const content = remark()
      .use(rewriteLink, {
        rewriter: (url) => url.replace("doc/docs", "")
      })
      .processSync(fs.readFileSync(file, "utf8"))
      .toString();

    fs.writeFileSync("./docs/index.md", content, "utf8");
  });

  glob.sync("../packages/linthtml/lib/rules/**/*.md").forEach((file) => {
    const content = remark()
      .use(rewriteLink, {
        rewriter: (url) => url.replace(/(\.\.\/)+doc\/docs/, "").replace(/\.\.\/([a-z-]+)\/README.md/, "$1.md")
      })
      .processSync(fs.readFileSync(file, "utf8"))
      .toString();
    const outputFile = path.join(
      rulesOutputDir,
      file.replace(/([a-z-\d]+)\/README.md/, "$1.md").replace("../packages/linthtml/lib/rules", "")
    );
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, content, "utf8");
  });
}

main();
