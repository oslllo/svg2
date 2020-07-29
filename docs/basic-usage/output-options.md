# Svg Options

Options to perform on the [SVG Element](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/svg) in the current [Svg2](basic-usage/svg2-constructor) `instance` before outputing.

- [`png()`](#output-png)
- [`bmp()`](#output-bmp)
- [`jpeg()`](#output-jpeg)
- [`tiff()`](#output-tiff)
- [`toUri()`](#output-to-uri)
- [`toFile()`](#output-to-file)
- [`toBuffer()`](#output-to-buffer)
- [`toElement()`](#output-to-element)

---

<a id="output-png"></a>

### png()

Convert `SVG` to `png`.

#### Usage

```js
Svg2("path/to/svg/example.svg").png()
.toFile("path/to/save/example.png")
.then(() => {
    console.log("done");
})
.catch((err) => {
    throw err;
});
```

##### Parameters

- `options` ([**Object**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)): containing the available options to perform on the image before outputing it.
    - `transparent` ([**Boolean**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)): if the `png` image should have a `transparent` background. **default(false)**

##### Throws

- [**TypeError**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError): if `parameters` are invalid.

##### Returns

- [**Svg2**](basic-usage/svg2-constructor)

##### Examples

###### Get | `png with transparent background`

```js
Svg2("path/to/svg/example.svg");.png({ transparent: true }) // set transparency settings
.toFile("path/to/save/example.png") // save png image to path
.then(() => {
    console.log("done"); // done
})
.catch((err) => {
    throw err;
});
```

---

<a id="output-bmp"></a>

### bmp()

Convert `SVG` to `bmp`.

#### Usage

```js
Svg2("path/to/svg/example.svg").bmp()
.toFile("path/to/save/example.bmp")
.then(() => {
    console.log("done");
})
.catch((err) => {
    throw err;
});
```

##### Returns

- [**Svg2**](basic-usage/svg2-constructor)

---

<a id="output-jpeg"></a>

### jpeg()

Convert `SVG` to `jpeg`.

#### Usage

```js
Svg2("path/to/svg/example.svg").jpeg()
.toFile("path/to/save/example.jpeg")
.then(() => {
    console.log("done");
})
.catch((err) => {
    throw err;
});
```

##### Returns

- [**Svg2**](basic-usage/svg2-constructor)

---

<a id="output-tiff"></a>

### tiff()

Convert `SVG` to `tiff`.

#### Usage

```js
Svg2("path/to/svg/example.svg").tiff()
.toFile("path/to/save/example.tiff")
.then(() => {
    console.log("done");
})
.catch((err) => {
    throw err;
});
```

##### Returns

- [**Svg2**](basic-usage/svg2-constructor)

---

<a id="output-to-uri"></a>

### toUri()

Get `SVG` image `URI` or `base64` string.

#### Usage

```js
Svg2("path/to/svg/example.svg").toUri()
.then((uri) => {
    console.log(uri);
    console.log("done");
})
.catch((err) => {
    throw err;
});
```

##### Parameters

- `options` ([**Object**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)): containing the available options to perform on the image before outputing it.
    - `base64` ([**Boolean**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)): return a `base64` string instead of a `URI` **default(false)**
    - `mime` ([**String**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)): return a `base64` string instead of a `URI` **default("image/png")**
- `callback` ([**Function**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)): if a callback is set a `Promise` is **not** returned.

##### Throws

- [**TypeError**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError): if `parameters` are invalid.

##### Returns

- [**Promise**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise): **if** `callback` is not set.

##### Examples

###### Get SVG PNG | `URI`

```js
Svg2("path/to/svg/example.svg").toUri({ base64: false, mime: Svg2.PNG })
.then((uri) => {
    console.log(uri); // data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAA...
    console.log("done");
})
.catch((err) => {
    throw err;
});
```

###### Get SVG PNG | `base64`

```js
Svg2("path/to/svg/example.svg").toUri({ base64: true, mime: Svg2.PNG })
.then((uri) => {
    console.log(uri); // iVBORw0KGgoAAAANSUhEUgAAADAAAAA...
    console.log("done");
})
.catch((err) => {
    throw err;
});
```

###### Get SVG PNG | `base64` | (callback)

```js
Svg2("path/to/svg/example.svg")
.toUri({ base64: true, mime: Svg2.PNG }, (err, uri) => {
    if (err) {
        throw err;
    }
    console.log(uri);
});
```

---

<a id="output-to-file"></a>

### toFile()

Export `SVG` to file.

#### Usage

```js
Svg2("path/to/svg/example.svg").png()
.toFile("path/to/store/example.png")
.then((uri) => {
    console.log("done");
})
.catch((err) => {
    throw err;
});
```

##### Parameters

- `destination` ([**String**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)): path to save image.
- `callback` ([**Function**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)): if a callback is set a `Promise` is **not** returned.

##### Throws

- [**TypeError**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError): if `parameters` are invalid.

##### Returns

- [**Promise**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise): **if** `callback` is not set.

##### Examples

###### Save to path | (promise)

```js
Svg2("path/to/svg/example.svg").png() // to png
.toFile("path/to/save/example.png") // save to path
.then(() => {
    console.log("done"); // log 'done' after the promise resolves
})
.catch((error) => {
    throw error;
});
```

###### Save to path | (callback)

```js
Svg2("path/to/svg/example.svg").png() // to png
.toFile("path/to/save/example.png", (err) => {
    if (err) {
        throw err;
    }
    console.log("done");  // log 'done' after the callback is called
});
```

---

<a id="output-to-buffer"></a>

### toBuffer()

Export `SVG` to buffer.

#### Usage

```js
Svg2("path/to/svg/example.svg").png()
.toBuffer()
.then((buffer) => {
    console.log("done");
})
.catch((err) => {
    throw err;
});
```

##### Parameters

- `callback` ([**Function**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)): if a callback is set a `Promise` is **not** returned.

##### Throws

- [**TypeError**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError): if `parameters` are invalid.

##### Returns

- [**Promise**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise): **if** `callback` is not set.

##### Examples

###### Get buffer | (promise)

```js
Svg2("path/to/svg/example.svg").png()
.toBuffer()
.then((buffer) => {
    console.log("done");
})
.catch((err) => {
    throw err;
});
```

###### Get buffer | (callback)

```js
Svg2("path/to/svg/example.svg").png()
.toBuffer((err, buffer) => {
    if (err) {
        throw err;
    }
    console.log("done");  // log 'done' after the callback is called
});
```

---

<a id="output-to-element"></a>

### toElement()

Export `SVG` to element.

#### Usage

```js
Svg2("path/to/svg/example.svg").toElement();
```

##### Parameters

- `input` ([**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [**Buffer**](https://nodejs.org/api/buffer.html)): path to `SVG`, raw `SVG` string or `Buffer` containing the svg.

##### Throws

- [**TypeError**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError): if `parameters` are invalid.

##### Returns

- [**SVGSVGElement**](https://developer.mozilla.org/en-US/docs/Web/API/SVGSVGElement)

##### Examples

###### Get element | from instance `SVG`

```js
    Svg2("path/to/svg/example.svg").toElement();
```

###### Get element | from path

```js
    Svg2("path/to/svg/example.svg").toElement("path/to/some/other/svg/example.svg");
```

---
