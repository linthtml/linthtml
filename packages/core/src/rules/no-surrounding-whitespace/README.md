# no-surrounding-whitespace

Disallow extra spacing just after a tag is opened and just before a tag is closed.

## The following patterns are considered violations

```html
<h1> Lorem ipsum</h1>
```

```html
<h1>Lorem ipsum   </h1>
```

```html
<h1> Lorem ipsum </h1>
```

```html
<p> <strong>Lorem</strong> ipsum</p>
```

```html
<p> <!-- comment --><strong>Lorem</strong> ipsum</p>
```

```html
<div> </div>
```

## The following patterns are not considered violations

```html
<h1>Lorem ipsum</h1>
```

```html
<p><strong>Lorem</strong> ipsum</p>
```

```html
<p><!-- comment --><strong>Lorem</strong> ipsum</p>
```

```html
<p>Lorem <strong>ipsum</strong></p>
```

```html
<div>
    <p>Lorem ipsum dolor sit amet...</p>
</div>
```

```html
<div>
    <p>
        Lorem ipsum dolor sit amet...
    </p>
</div>
```

```html
<div>
    <p>
        <!-- comment -->
        Lorem ipsum dolor sit amet...
        <!-- comment -->
    </p>
</div>
```

```html
<div></div>
```
