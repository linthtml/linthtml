# indent-style

Enforce consistent indentation style.

## Options

Possible values :

* `"tabs"`: Only tabs may be used for indentation.
* `"spaces"`: Only spaces may be used for indentation.
* `"nonmixed"`: Either tabs or spaces may be used, but not both in the same file.
* `false`: No restriction

Given:

```
  "indent-style": [true, "spaces"]
```

The following patterns are considered violations:

```html
/*tab*/<button id="buttonBlue"></button>
```

The following patterns are not considered violations:

```html
/*space*//*space*/<button id="buttonBlue"></button>
```
