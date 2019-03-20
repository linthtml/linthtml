# tag-req-attr

If set, specified attributes should be present on the specified tag.

Given :

```json
{
  "tag-req-attr": {
    img: [
      {
        name: "src"
      },
      {
        name: "alt"
      }
    ]
  }
}
```

The following patterns are considered violations:

```html
<img/>
```

```html
<img src="link"/>
```

```html
<img alt="No image">
```

The following patterns are not considered violations:

```html
<img alt="Picture of a cute cat" src="https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwiHzdu5n4ThAhXOxYUKHebmDXoQjRx6BAgBEAU&url=https%3A%2F%2Fimgur.com%2Fgallery%2FHzG2YW8&psig=AOvVaw3w5Zu0oMuDZy83zsfn0NMU&ust=1552742695628256"/>
```
