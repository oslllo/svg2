# Svg Element

Options to perform on the [SVG Element](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/svg) in the current [Svg2](basic-usage/svg2-constructor) `instance` before outputing.

- [`update()`](#svg-update)
- [`resize()`](#svg-resize)
- [`html()`](#svg-html)
- [`element()`](#svg-element)
- [`dimensions()`](#svg-dimensions)

---

## Usage

```js
var instance = Svg2("path/to/svg/example.svg");
var svg = instance.svg;
```

---

<a id="svg-update"></a>

## update()

Update instance `SVG` with a new one.

### Usage

```js
var instance = Svg2("path/to/svg/old.svg");
var svg = instance.svg;
svg.update("path/to/svg/new.svg");
```

### Parameters

- `svg` ([**SVGSVGElement**](https://developer.mozilla.org/en-US/docs/Web/API/SVGSVGElement) | [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [**Buffer**](https://nodejs.org/api/buffer.html)): path to `SVG`, `SVG` string or `Buffer` containing the svg.

- `isElement` [**Boolean**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean): set to `true` if `svg` is an instance of `SVGSVGElement` else set to false. **default(false)**

### Throws

- [**TypeError**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError): if `parameters` or the `SVG` are invalid.

### Returns

- [**Svg2**](basic-usage/svg2-constructor)

### Examples

#### Using | `path`

```js
const Svg2 = require("oslllo-svg2");

var instance = Svg2("path/to/svg/old.svg"); // create Svg2 instance
var svg = instance.svg; // get svg option instance
svg.update("path/to/svg/new.svg"); // update svg
```

#### Using | `buffer`

```js
const fs = require("fs");
const Svg2 = require("oslllo-svg2");

var instance = Svg2("path/to/svg/old.svg"); // create Svg2 instance
var svg = instance.svg; // get svg option instance
var buffer = fs.readFileSync("path/to/svg/new.svg"); // get new svg string buffer
svg.update(buffer); // update svg
```

#### Using | `svg string`

```js
const Svg2 = require("oslllo-svg2");

var instance = Svg2("path/to/svg/old.svg"); // create Svg2 instance
var svg = instance.svg; // get svg option instance
svg.update(`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4.480 2.040 C 3.403 2.228,2.518 3.004,2.133 4.100 L 2.020 4.420 2.020 11.980 L 2.020 19.540 2.112 19.831 C 2.430 20.837,3.163 21.570,4.169 21.888 L 4.460 21.980 12.020 21.980 L 19.580 21.980 19.900 21.867 C 20.871 21.526,21.526 20.870,21.867 19.900 L 21.980 19.580 21.980 12.020 L 21.980 4.460 21.888 4.169 C 21.576 3.181,20.893 2.481,19.900 2.133 L 19.580 2.020 12.120 2.014 C 8.017 2.011,4.579 2.023,4.480 2.040 M19.308 4.060 C 19.541 4.129,19.782 4.342,19.902 4.582 C 19.979 4.737,19.980 4.867,19.980 12.000 C 19.980 19.101,19.978 19.263,19.903 19.416 C 19.804 19.615,19.615 19.804,19.416 19.903 C 19.263 19.978,19.101 19.980,12.000 19.980 C 4.899 19.980,4.737 19.978,4.584 19.903 C 4.385 19.804,4.196 19.615,4.097 19.416 C 4.022 19.264,4.020 19.090,4.009 12.100 C 4.001 7.020,4.010 4.888,4.041 4.760 C 4.122 4.426,4.395 4.141,4.726 4.046 C 4.810 4.022,7.532 4.006,11.983 4.004 C 18.214 4.000,19.131 4.008,19.308 4.060 M8.569 8.103 C 8.212 8.281,8.002 8.614,8.002 9.000 C 8.002 9.399,8.061 9.476,9.371 10.790 L 10.578 12.000 9.371 13.210 C 8.061 14.524,8.002 14.601,8.002 15.000 C 8.002 15.714,8.756 16.208,9.400 15.917 C 9.532 15.857,9.903 15.513,10.790 14.629 L 12.000 13.422 13.210 14.629 C 14.097 15.513,14.468 15.857,14.600 15.917 C 15.409 16.282,16.282 15.409,15.917 14.600 C 15.857 14.468,15.513 14.097,14.629 13.210 L 13.422 12.000 14.626 10.790 C 15.289 10.125,15.863 9.518,15.901 9.442 C 15.939 9.366,15.979 9.193,15.990 9.059 C 16.049 8.325,15.272 7.780,14.600 8.083 C 14.468 8.143,14.097 8.487,13.210 9.371 L 12.000 10.578 10.790 9.371 C 9.903 8.487,9.532 8.143,9.400 8.083 C 9.141 7.966,8.829 7.973,8.569 8.103 " stroke="none" fill="black" fill-rule="evenodd"></path>
</svg>`); // update svg
```

#### Using | `element`

```js
const Svg2 = require("oslllo-svg2");

var instance = Svg2("path/to/svg/old.svg"); // create Svg2 instance
var svg = instance.svg; // get svg option instance
var element = Svg2("path/to/svg/new.svg").toElement(); // get new svg element
svg.update(element); // update svg
```

---

<a id="svg-resize"></a>

## resize()

Resize `SVG Element` in current instance.

### Usage

```js
var instance = Svg2("path/to/svg/example.svg");
var svg = instance.svg;
svg.resize({ widht: 100, height: 100 });
```

### Parameters

- `input` ([**Object**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [**Number**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)): containing `width` / `height` properties or a `number` to scale the dimensions.

### Throws

- [**TypeError**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError): if `parameters` are invalid.

### Returns

- [**Svg2**](basic-usage/svg2-constructor)

### Examples

#### Using | `object`

> Adjust both `width` and `height`

```js
const Svg2 = require("oslllo-svg2");

var instance = Svg2("path/to/svg/example.svg"); // create Svg2 instance
var svg = instance.svg; // get svg option instance
console.log(svg.dimensions()); // { width: 24, height: 24 }
svg.resize({ width: 100, height: 100 }); // resize svg
console.log(svg.dimensions()); // { width: 100, height: 100 }
```

> Adjust `width` or `height` **only**

```js
const Svg2 = require("oslllo-svg2");

var instance = Svg2("path/to/svg/example.svg"); // create Svg2 instance
var svg = instance.svg; // get svg option instance
console.log(svg.dimensions()); // { width: 24, height: 24 }
svg.resize({ width: 100 }); // resize svg
console.log(svg.dimensions()); // { width: 100, height: 24 }
svg.resize({ height: 100 }); // resize svg
console.log(svg.dimensions()); // { width: 100, height: 100 }
```

> Adjust `width` or `height` **only** and `AUTO` adjust the missing dimension

```js
const Svg2 = require("oslllo-svg2");

var instance = Svg2("path/to/svg/example.svg"); // create Svg2 instance
var svg = instance.svg; // get svg option instance
console.log(svg.dimensions()); // { width: 24, height: 24 }
svg.resize({ width: 100, height: Svg2.AUTO }); // resize svg
console.log(svg.dimensions()); // { width: 100, height: 100 }
svg.resize({ height: Svg2.AUTO, width: 50 }); // resize svg
console.log(svg.dimensions()); // { width: 50, height: 50 }
```

> Scale dimensions using a `number`

```js
const Svg2 = require("oslllo-svg2");

var instance = Svg2("path/to/svg/example.svg"); // create Svg2 instance
var svg = instance.svg; // get svg option instance
console.log(svg.dimensions()); // { width: 24, height: 24 }
svg.resize(2); // resize svg
console.log(svg.dimensions()); // { width: 48, height: 48 }
```

---

<a id="svg-html"></a>

## html()

Get instance `SVG` `string` (outerHTML)`.

### Usage

```js
var instance = Svg2("path/to/svg/example.svg");
var svg = instance.svg;
svg.html();
```

### Returns

- [**string**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String): instance svg `string` (outerHTML).

### Examples

```js
const Svg2 = require("oslllo-svg2");

var instance = Svg2("path/to/svg/example.svg"); // create Svg2 instance
var svg = instance.svg; // get svg option instance
svg.html(); // returns <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.480 2.040 C 3.403 2.228,2.518 3.004,2.133 4.100 L 2.020 4.420 2.020 11.980 L 2.020 19.540 2.112 19.831 C 2.430 20.837,3.163 21.570,4.169 21.888 L 4.460 21.980 12.020 21.980 L 19.580 21.980 19.900 21.867 C 20.871 21.526,21.526 20.870,21.867 19.900 L 21.980 19.580 21.980 12.020 L 21.980 4.460 21.888 4.169 C 21.576 3.181,20.893 2.481,19.900 2.133 L 19.580 2.020 12.120 2.014 C 8.017 2.011,4.579 2.023,4.480 2.040 M19.308 4.060 C 19.541 4.129,19.782 4.342,19.902 4.582 C 19.979 4.737,19.980 4.867,19.980 12.000 C 19.980 19.101,19.978 19.263,19.903 19.416 C 19.804 19.615,19.615 19.804,19.416 19.903 C 19.263 19.978,19.101 19.980,12.000 19.980 C 4.899 19.980,4.737 19.978,4.584 19.903 C 4.385 19.804,4.196 19.615,4.097 19.416 C 4.022 19.264,4.020 19.090,4.009 12.100 C 4.001 7.020,4.010 4.888,4.041 4.760 C 4.122 4.426,4.395 4.141,4.726 4.046 C 4.810 4.022,7.532 4.006,11.983 4.004 C 18.214 4.000,19.131 4.008,19.308 4.060 M8.569 8.103 C 8.212 8.281,8.002 8.614,8.002 9.000 C 8.002 9.399,8.061 9.476,9.371 10.790 L 10.578 12.000 9.371 13.210 C 8.061 14.524,8.002 14.601,8.002 15.000 C 8.002 15.714,8.756 16.208,9.400 15.917 C 9.532 15.857,9.903 15.513,10.790 14.629 L 12.000 13.422 13.210 14.629 C 14.097 15.513,14.468 15.857,14.600 15.917 C 15.409 16.282,16.282 15.409,15.917 14.600 C 15.857 14.468,15.513 14.097,14.629 13.210 L 13.422 12.000 14.626 10.790 C 15.289 10.125,15.863 9.518,15.901 9.442 C 15.939 9.366,15.979 9.193,15.990 9.059 C 16.049 8.325,15.272 7.780,14.600 8.083 C 14.468 8.143,14.097 8.487,13.210 9.371 L 12.000 10.578 10.790 9.371 C 9.903 8.487,9.532 8.143,9.400 8.083 C 9.141 7.966,8.829 7.973,8.569 8.103 " stroke="none" fill="black" fill-rule="evenodd"></path></svg>
```

---

<a id="svg-element"></a>

## element()

Get instance `SVG` element / `SVGSVGElement` instance.

### Usage

```js
var instance = Svg2("path/to/svg/example.svg");
var svg = instance.svg;
svg.element();
```

### Returns

- [**SVGSVGElement**](https://developer.mozilla.org/en-US/docs/Web/API/SVGSVGElement)

### Examples

```js
const Svg2 = require("oslllo-svg2");

var instance = Svg2("path/to/svg/example.svg"); // create Svg2 instance
var svg = instance.svg; // get svg option instance
svg.element(); // returns svg element
```

---

<a id="svg-dimensions"></a>

## dimensions()

Get instance `SVG` dimensions (`width` and `height`).

### Usage

```js
var instance = Svg2("path/to/svg/example.svg");
var svg = instance.svg;
svg.dimensions();
```

### Returns

- [**Object**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object): containing `width` and `height`

### Examples

```js
const Svg2 = require("oslllo-svg2");

var instance = Svg2("path/to/svg/example.svg"); // create Svg2 instance
var svg = instance.svg; // get svg option instance
svg.dimensions(); // { width: 24, height: 24 }
```
