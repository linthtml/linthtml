# button-req-content

See [WCAG Success Criteria \[WCAG 2.1 (A)\]](https://www.w3.org/TR/WCAG22/#name-role-value): Each `button` element must contain content.

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
