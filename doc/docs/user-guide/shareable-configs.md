---
title: Shareable Configs
sidebar_label: Shareable Configs
---

The configuration that you have in your `.linthtmlrc` file is an important part of your project, and as such, you may want to share it with other projects or people. Shareable configs allow you to publish your configuration settings on [npm](https://www.npmjs.com/) and have others download and use it in their LintHTML projects.

## Creating a Shareable Config

Shareable configs are simply npm packages that export a configuration object. To start, [create a Node.js module](https://docs.npmjs.com/getting-started/creating-node-modules) like you normally would.

Create a new `index.js` file and export an object containing your settings:

```js
module.exports = {
  rules: {
    "indent-size": ["error", 2]
  }
};
```

Since `index.js` is just JavaScript, you can optionally read these settings from a file or generate them dynamically.

## Publishing a Shareable Config

Once your shareable config is ready, you can [publish to npm](https://docs.npmjs.com/getting-started/publishing-npm-packages) to share with others. We recommend using the `linthtml` and `linthtml-config` keywords so others can easily find your module.

You should declare your dependency on LintHTML in `package.json` using the [peerDependencies](https://docs.npmjs.com/files/package.json#peerdependencies) field. <!-- The recommended way to declare a dependency for future proof compatibility is with the ">=" range syntax, using the lowest required LintHTML version. For example: -->

```json
"peerDependencies": {
    "@linthtml/linthtml": "^0.6.0"
}
```

<!-- 
If your shareable config depends on a plugin, you should also specify it as a `peerDependency` (plugins will be loaded relative to the end user's project, so the end user is required to install the plugins they need). However, if your shareable config depends on a third-party parser or another shareable config, you can specify these packages as `dependencies`. -->

You can also test your shareable config on your computer before publishing by linking your module globally. Type:

```bash
npm link
```

Then, in your project that wants to use your shareable config, type:

```bash
npm link my-linthtml-config
```

Be sure to replace `my-linthtml-config` with the actual name of your module.

## Using a Shareable Config

Shareable configs are designed to work with the `extends` feature of `.linthtmlrc` files. Instead of using a file path for the value of `extends`, use your module name. For example:

```json
{
    "extends": "my-linthtml-config"
}
```

_LintHTML has a shared config you can use, [linthtml-config-recommended](https://github.com/linthtml/linthtml-config-recommended)_

### npm scoped modules

npm [scoped modules](https://docs.npmjs.com/misc/scope) are also supported.

```json
{
    "extends": "@scope/my-linthtml-config"
}
```

You can override settings from the shareable config by adding them directly into your `.linthtmlrc` file.

## Sharing Multiple Configs

It's possible to share multiple configs in the same npm package. You can specify a default config for the package by following the directions in the first section. You can specify additional configs by simply adding a new file to your npm package and then referencing it from your LintHTML config.

As an example, you can create a file called `my-special-config.js` in the root of your npm package and export a config, such as:

```js
module.exports = {
  rules: {
    "attr-quote-style": ["error", "double"]
  }
};
```

Then, assuming you're using the package name `linthtml-config-myconfig`, you can access the additional config via:

```json
{
    "extends": "linthtml-config-myconfig/my-special-config"
}
```

Note that you can leave off the `.js` from the filename. In this way, you can add as many additional configs to your package as you'd like.

<!-- **Important:** We strongly recommend always including a default config for your plugin to avoid errors. -->

## Local Config File Resolution

If you need to make multiple configs that can extend from each other and live in different directories, you can create a single shareable config that handles this scenario.

As an example, let's assume you're using the package name `linthtml-config-myconfig` and your package looks something like this:

```text
myconfig
├── index.js
└─┬ lib
  ├── defaults.js
  ├── other.js
  ├── shared.js
  └─┬ shared
    ├── team-a.js
    ├── team-b.js
    └── common.js
```

In your `index.js` you can do something like this:

```js
module.exports = require('./lib/shared.js');
```

Now inside your package you have `/lib/defaults.js`, which contains:

```js
module.exports = {
  rules: {
    "doctype-html5": "error"
  }
};
```

Inside your `/lib/shared.js` you have

```js
module.exports = require('./shared/team-a');
```

Inside your `/lib/shared/common.js`

```js
module.exports = {
  rules: {
    'id-no-dup': "error"
  },
  extends: 'myconfig/lib/defaults'
};
```

Despite being in an entirely different directory, you'll see that all `extends` must use the full package path to the config file you wish to extend.

Now inside your `/lib/shared/team-a.js`

```js
module.exports = {
  rules: {
    "doctype-html5": "error"
  },
  extends: 'myconfig/lib/ci/common'
};
```

In the last file, you'll once again see that to properly resolve your config, you'll need include the full package path.

## Further Reading

* [npm Developer Guide](https://docs.npmjs.com/misc/developers)
