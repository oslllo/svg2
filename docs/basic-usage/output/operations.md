# Output Image Operations

Operation options to perform on the image before output.

- [`background()`](#output-image-background)

---

<a id="output-image-background"></a>

## background()

Change background of the image to the provided background colour.

### Usage

```js
Svg2("path/to/svg/example.svg")
.png()
.background({ color: "#0252AB" })
.toFile("path/to/save/example.png")
.then(() => {
    console.log("done");
})
.catch((err) => {
    throw err;
});
```

### Parameters

- `options` ([**Object**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [**String**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)): containing the available options to perform on the image before outputing it.
    - `color` ([**String**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)): Extension background **[hexadecimal](https://en.wikipedia.org/wiki/Web_colors#Hex_triplet)** color. **default("#ffffff")**

### Throws

- [**TypeError**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError): if `parameters` are invalid.

### Returns

- [**Svg2**](basic-usage/svg2-constructor)

### Examples

#### Image produced from a `SVG` that we are going to be using in our example

![background-none](../images/output/background/background-none.png)

---

##### Background | to "#0252AB"

```js
Svg2("path/to/svg/example.svg")
.png()
.background({ color: "#0252AB" })
.toFile("path/to/save/example.png")
.then(() => {
    console.log("done");
})
.catch((err) => {
    throw err;
});

// OR

Svg2("path/to/svg/example.svg")
.png()
.background("#0252AB")
.toFile("path/to/save/example.png")
.then(() => {
    console.log("done");
})
.catch((err) => {
    throw err;
});
```

###### Outputs

![background-blue](../images/output/background/background-blue.png)

---
