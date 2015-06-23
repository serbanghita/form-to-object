# formToObject.js

[![Build Status](https://travis-ci.org/serbanghita/formToObject.js.svg)](https://travis-ci.org/serbanghita/formToObject.js) [![Dependency Status](https://www.versioneye.com/user/projects/5446a74944a5254346000085/badge.svg?style=flat)](https://www.versioneye.com/user/projects/5446a74944a5254346000085)

> Convert **HTML forms** with all their **fields** and **values** to **multi-dimensional JavaScript** objects


##### How to use

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
