# lang-style

If set, the lang tag must have a valid form (`xx-YY`, where `xx` is a valid language code and `YY` is a valid country code). If the value is equal to "case", the tag must be capitalized conventionally (with the language code lowercase and the country code uppercase).

Given:

```
  "lang-style": [true, "xx"]
```

The following patterns are considered violations:

```html
<html lang="" >
```

```html
<html lang="fr" >
```

The following patterns are not considered violations:

```html
<html lang="FR" >
```
