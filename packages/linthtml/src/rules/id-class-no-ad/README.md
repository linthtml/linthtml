# id-class-no-ad

If set, values for the `id` and `class` attributes may not use the word "ad", "banner", or "social".
This rule only bans those words when not adjacent to other alphanumeric characters. Thus words like "gradient" are still allowed.

The following patterns are considered violations:

```html
<div id="qofwj_ad_ofqijoi"></div>
````

```html
<div class="definitely-not-an-ad"></div>
```

```html
<div id="**banner**" class="~~social~~"></div>
```

The following patterns are not considered violations:

```html
<div id="abc" class="fowj0wo3"></div>
```

```html
<div id="bad" class="sadness"></div>
````
  