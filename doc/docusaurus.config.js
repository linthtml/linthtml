// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
const path = require("path");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "LintHTML HTML linter",
  tagline: "",
  url: "https://linthtml.vercel.app",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "facebook", // Usually your GitHub org/user name.
  projectName: "docusaurus", // Usually your repo name.

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          breadcrumbs: false,
          routeBasePath: "/",
          path: "docs",
          sidebarPath: "./sidebars.json"
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css")
        },
        blog: false
      })
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "LintHTML",
        // logo: {
        //   alt: "My Site Logo",
        //   src: "img/logo.png"
        // },
        items: [
          {
            to: "/",
            label: "Docs",
            position: "left"
          },
          {
            to: "api",
            label: "API",
            position: "left"
          },
          {
            href: "https://github.com/linthtml/linthtml",
            label: "GitHub",
            position: "right"
          }
        ]
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      }
    }),
  plugins: [
    [
      "docusaurus-plugin-typedoc-api",
      {
        projectRoot: path.join(__dirname, ".."),
        // Monorepo
        packages: [
          {
            path: "packages/dom-utils",
            entry: {
              index: "lib/index.ts"
            }
          }
        ]
      }
    ]
  ]
};

module.exports = config;
