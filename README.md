# formToObject.js
> Convert **HTML forms** with all their **fields** and **values** to **multidimensional JavaScript** objects

![Workflow status](https://img.shields.io/github/actions/workflow/status/serbanghita/formToObject/test.yml?style=flat-square)
![Latest tag](https://img.shields.io/github/v/tag/serbanghita/formToObject?style=flat-square)
![npm version](https://img.shields.io/npm/v/form_to_object?style=flat-square)
![npm downloads](https://img.shields.io/npm/dm/form_to_object?style=flat-square)



## Install

As a npm package:

```shell
npm install form_to_object
```

Inside the HTML code:

```html
<!-- Include minified script (~2kb) -->
<script src="dist/formToObject.min.js"></script>
```

## Usage

Using the DOM node id:

```js
formToObject('myFormId');
```

Using the actual DOM Node reference:

```js
formToObject(document.getElementById('myFormId'));
```

Example result:    

```js
{
  saveSettings: 'Save',
  name: 'Serban',
  race: 'orc',
  settings: {
     input: 'keyboard',
     video: {
        resolution: '1024x768',
        vsync: 'on'
     }
  }
}
```


## Browser support

IE 8, Firefox 3.5, Chrome, Safari, Opera 10, every mobile browser.

## Example

![](http://serbanghita.github.io/formToObject.js/formToObj-demo.png)