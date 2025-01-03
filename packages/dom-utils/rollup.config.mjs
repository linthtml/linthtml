import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import packageJSON from "./package.json" with { type: "json" };

const fileExtensions = [".js", ".jsx", ".ts", ".tsx"];

const externalPackages = [
  ...Object.keys(packageJSON.dependencies || {}),
  ...Object.keys(packageJSON.peerDependencies || {})
];

export default {
  input: {
    attr_parse: "src/attr_parse.ts",
    boolean_attrs: "src/boolean_attrs.ts",
    check_lang_attribute: "src/check_lang_attribute.ts",
    dom_elements: "src/dom_elements.ts",
    index: "src/index.ts",
    is_labelable: "src/is_labelable.ts",
    is_void_node: "src/is_void_node.ts",
    tags: "src/tags.ts",
    text_node: "src/text_node.ts"
  },
  output: [
    {
      dir: "dist",
      entryFileNames: "[name].cjs",
      format: "cjs"
    },
    {
      dir: "dist",
      entryFileNames: "[name].js",
      format: "esm"
    }
  ],
  external: (id) => {
    return externalPackages.some((name) => id === name || id.startsWith(`${name}/`)); // Could be a deep import
  },
  plugins: [
    typescript({
      tsconfig: "tsconfig.lib.json"
    }),
    nodeResolve({
      preferBuiltins: true,
      fileExtensions
    }),
    commonjs()
  ]
};
