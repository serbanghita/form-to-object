# formToObject.js

[![Build Status](https://travis-ci.org/serbanghita/formToObject.js.svg?branch=devel)](https://travis-ci.org/serbanghita/formToObject.js) [![Dependency Status](https://www.versioneye.com/user/projects/5446a74944a5254346000085/badge.svg?style=flat)](https://www.versioneye.com/user/projects/5446a74944a5254346000085)

> Ever wanted to convert a **HTML form** with all it's **fields** and **values** to a **multi-dimensional JavaScript** object?


##### Include

```html
<!-- Include script (~6kb) -->
<script src="src/formToObject.js"></script>
```

```html
<!-- Include minified script (~2kb) -->
<script src="build/formToObject.min.js"></script>
```

##### Usage

Using the form's id value:

```javascript
var myFormObj = formToObject('myFormId');
console.log(myFormObj);
```

Using the actual DOM Node:

```javascript
var $formNode = document.getElementById('myFormId');
var myFormObj = formToObject($formNode);
console.log(myFormObj);
```

Real case scenario with jQuery AJAX:

```javascript
$.ajax({
  'url': '/app/settings/save/',
  'type': 'post',
  'data': formToObject('saveSettingsForm'),
  'success': function(r){
  	console.log(r);
  }
});
```

##### Comparison with other solutions

*Prototype.js* - Creates a *JavaScript object* but it's not multi-dimensional. In `"settings[theme][type]": "dark"` the key is a string. Tested with the latest built version from git, 1.7.1 throws errors.

```javascript
Form.serialize($('test'), true);
```
---

*jQuery core* - Creates a *JavaScript array of objects*, ready to be encoded as a JSON string. It takes in account the W3C rules for [successful controls](http://www.w3.org/TR/html401/interact/forms.html#h-17.13.2). Output is like `[Object, Object, Object ...]`

```javascript
$('#form').serializeArray()
```

---

*Backbone.Syphon* - Creates a *multi-dimensional JavaScript object* with only a [few limitations](https://github.com/derickbailey/backbone.syphon#current-limitations). Has the ability to include/exclude fields.

```javascript
Backbone.Syphon.serialize(this); // called in a Backbone.View
```

---

*[dojo.formToObject](https://dojotoolkit.org/reference-guide/1.9/dojo/dom-form.html#dojo-dom-form-toobject)* - Depends on dojo framework. Disabled form elements, buttons, elements with just an id attribute but no name attribute, and other non-valued HTML elements are skipped.

```javascript
domForm.toObject("myId")
```

---

*[jQuery.serializeObject](https://github.com/hongymagic/jQuery.serializeObject)* - Plugin for jQuery.

```javascript
$('form').serializeObject();
```

---

*[jQuery.serializeForm](https://github.com/danheberden/jquery-serializeForm)* - Plugin for jQuery.

```javascript
$('#test').serializeForm();
```

---

*[jQuery.serializeJSON](https://github.com/marioizquierdo/jquery.serializeJSON)* - Adds the method `serializeJSON()` to jQuery, that serializes a form into a JavaScript Object with the same format as the default Ruby on Rails request params hash.

```javascript
$('#test').serializeJSON()
```

---

*plain JavaScript*

```javascript
formToObject('form')
```

Creates a *multi-dimensional JavaScript object* with all the field names and values.


##### Browser support

IE 8, Firefox 3.5, Chrome, Safari, Opera 10, every mobile browser.

##### Screenshot

![](http://ghita.org/sites/default/files/articles_imgs/formToObject.png)

##### Contribute

[Add an issue](https://github.com/serbanghita/formToObject/issues/new) or fork the project and submit a pull request. 

If this script helped you save a lot of developing time, I really appreciate any donations
[![](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=serbanghita%40gmail%2ecom&lc=US&item_name=Serban%20Ghita%20%28GitHub%29&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted)
