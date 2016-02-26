# formToObject.js

[![Build Status][build-status-img]]([build-status-url]) 
[![NPM package][npm-img]]([npm-url])
[![NPM downloads][npm-downloads-img]]([npm-downloads-url])
[![Dependency Status][dependencies-status-img]]([dependencies-status-url])

> Convert **HTML forms** with all their **fields** and **values** to **multi-dimensional JavaScript** objects


##### How to use
 > Supports Traditional, RequireJS / AWD and CommonJS / Browserfy style imports.

```html
<!-- Include minified script (~2kb) -->
<script src="build/formToObject.min.js"></script>
```


**Using the DOM node id**

```javascript
var myFormObj = formToObject('myFormId');
/* 
  console.log(myFormObj);
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
*/
```

**Using the actual DOM Node**

```javascript
var $formNode = document.getElementById('myFormId');
var myFormObj = formToObject($formNode);
console.log(myFormObj);
```

Sending form data server-side

```javascript
$.ajax({
  'url': '/app/settings/save/',
  'type': 'post',
  'data': formToObject('saveSettingsForm'),
  'success': function(r){}
});
```

##### Browser support

IE 8, Firefox 3.5, Chrome, Safari, Opera 10, every mobile browser.

##### Screenshot

![](http://serbanghita.github.io/formToObject.js/formToObj-demo.png)

[build-status-img]:https://travis-ci.org/serbanghita/formToObject.js.svg?style=flat
[build-status-url]:https://travis-ci.org/serbanghita/formToObject.js
[npm-img]:https://img.shields.io/npm/v/form_to_object.svg?style=flat-square
[npm-url]:https://www.npmjs.com/package/form_to_object
[npm-downloads-img]: http://img.shields.io/npm/dm/form_to_object.svg?style=flat-square
[npm-downloads-url]: https://www.npmjs.com/package/form_to_object
[dependencies-status-img]:https://www.versioneye.com/user/projects/5446a74944a5254346000085/badge.svg?style=flat
[dependencies-status-url]:https://www.versioneye.com/user/projects/5446a74944a5254346000085
