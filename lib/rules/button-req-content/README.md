# button-req-content

See WCAG rule [78](http://oaa-accessibility.org/wcag20/rule/78/): Each `button` element must contain content.

The following patterns are considered violations:

```html
  <button></button>
```

```html
  <button>       </button>
```

```html
  <button><span><span></span></span></button>
```

```html
  <button aria-label=""></button>
```

The following patterns are not considered violations:

```html
  <button>Click me</button>
```

```html
  <button><span><strong>Click</strong> me</span></button>
```

```html
  <button aria-label="Click me"></button>
```
