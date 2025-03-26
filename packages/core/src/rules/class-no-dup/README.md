# class-no-dup

Disallow the duplication of a classname inside the `class` attribute.

The following patterns are considered violations:

```html
  <div class="foo bar foo"></div>
```

```html
  <div class="bar bar"></div>
```

The following patterns are not considered violations:

```html
  <div class="foo bar"></div>
```

## Options

This rule accept the following option object

```ts
"class-no-dup": [true, {
  ignore?: string | RegExp
}],
```

### ignore

String or regexp used to ignore some classnames.

```js
module.exports = {
  rules: {
    "class-no-dup": [
      "error", 
      {
        ignore: /^f/
      }
    ]
  },
};
```

The following patterns are considered violations:

```html
  <div class="bar bar"></div>
```

The following patterns are not considered violations:

```html
  <div class="foo foo"></div>
```
