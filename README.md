# formToObject.js

[![Build Status](https://travis-ci.org/serbanghita/formToObject.js.svg?branch=devel)](https://travis-ci.org/serbanghita/formToObject.js)

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

##### Browser support

IE 8, Firefox 3.5, Chrome, Safari, Opera 10, every mobile browser.

##### Screenshot

![](http://serbanghita.github.io/formToObject.js/formToObj-demo.png)

##### Contribute

[Add an issue](https://github.com/serbanghita/formToObject/issues/new) or fork the project and submit a pull request. 

If this script helped you save a lot of developing time, I really appreciate any donations
[![](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=serbanghita%40gmail%2ecom&lc=US&item_name=Serban%20Ghita%20%28GitHub%29&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted)
