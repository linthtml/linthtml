import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "LintHTML - HTML linter",
  tagline: "",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://linthtml.vercel.app",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "linthtml", // Usually your GitHub org/user name.
  projectName: "linthtml", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"]
  },

  presets: [
    [
      "classic",
      {
        docs: {
          breadcrumbs: false,
          sidebarPath: "./sidebars.ts",
          path: "docs",
          routeBasePath: "/"
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css"
        }
      } satisfies Preset.Options
    ]
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "LintHTML",
      logo: {
        alt: "My Site Logo",
        src: "img/logo.svg"
      },
      items: [
        {
          to: "/",
          label: "Docs",
          position: "left"
        },
        // {
        //   to: "api",
        //   label: "API",
        //   position: "left"
        // },
        // { to: "/blog", label: "Blog", position: "left" },
        {
          href: "https://github.com/linthtml/linthtml",
          label: "GitHub",
          position: "right"
        }
      ]
    },
    // footer: {
    //   style: "dark",
    //   links: [
    //     {
    //       title: "Docs",
    //       items: [
    //         {
    //           label: "Tutorial",
    //           to: "/docs/intro"
    //         }
    //       ]
    //     },
    //     {
    //       title: "Community",
    //       items: [
    //         {
    //           label: "Stack Overflow",
    //           href: "https://stackoverflow.com/questions/tagged/docusaurus"
    //         },
    //         {
    //           label: "Discord",
    //           href: "https://discordapp.com/invite/docusaurus"
    //         },
    //         {
    //           label: "Twitter",
    //           href: "https://twitter.com/docusaurus"
    //         }
    //       ]
    //     },
    //     {
    //       title: "More",
    //       items: [
    //         {
    //           label: "Blog",
    //           to: "/blog"
    //         },
    //         {
    //           label: "GitHub",
    //           href: "https://github.com/facebook/docusaurus"
    //         }
    //       ]
    //     }
    //   ],
    //   copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`
    // },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula
    }
  } satisfies Preset.ThemeConfig
};

export default config;
// plugins: [
//   // [
//   //   "docusaurus-plugin-typedoc-api",
//   //   {
//   //     projectRoot: path.join(__dirname, ".."),
//   //     // Monorepo
//   //     packages: [
//   //       {
//   //         path: "packages/dom-utils",
//   //         entry: {
//   //           index: "src/index.ts"
//   //         }
//   //       }
//   //     ]
//   //   }
//   // ]
// ]
