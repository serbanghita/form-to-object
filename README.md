Ever wanted to convert a HTML <b>form</b> with all it's <b>fields</b> and <b>values</b> to a <b>multi-dimensional JavaScript</b> object?<br>
Here is the easiest way, no 3rd party libraries, only vanilla JavaScript.

##### Comparison with 3rd party solutions

<table>
<tr>
<td>Prototype.js</td>
<td><code>Form.serialize($('testForm'), true);</code></td>
<td>Creates a <i>JavaScript object</i> but it's not multi-dimensional. In <code>"settings[theme][type]": "dark"</code> the key is a string. Tested with the latest built version from git, 1.7.1 throws errors.</td>
</tr>
<tr>
<td>jQuery</td>
<td><code>$('#form').serializeArray()</code></td><td>Creates a <i>JavaScript array of objects</i>, ready to be encoded as a JSON string. It takes in account the W3C rules for <a href="http://www.w3.org/TR/html401/interact/forms.html#h-17.13.2">successful controls</a>. Output is like <code>[
[Object], [Object], [Object] ...</code></td>
</tr>
<tr>
<td>Backbone.Syphon</td>
<td><code>Backbone.Syphon.serialize(this);</code> called in a <code>Backbone.View</code></td>
<td>Creates a <i>multi-dimensional JavaScript object</i> with only a <a href="https://github.com/derickbailey/backbone.syphon#current-limitations">few limitations</a>. Has the ability to include/exclude fields.</td>
</tr>
<tr>
<td>plain JavaScript</td>
<td><code>new formToObject('form')</code></td>
<td>Creates a <i>multi-dimensional JavaScript object</i> with all the field names and values.</td>
</tr>
</table>

##### Browser support

IE 8, Firefox 3.5, Chrome, Safari, Opera 10, every mobile browser.

##### Example

```html
<!-- Include the method in your library. -->
<script src="/js/formToObject.js"></script>
```

Using the form's id value:

```javascript
// console.log(myFormObj);
var myFormObj = new formToObject('myFormId');
```

Using the actual DOM Node:

```javascript
var formNode  = document.getElementById('myFormId');
var myFormObj = new formToObject(formNode);
```

##### Screenshot

<img src="http://ghita.org/sites/default/files/articles_imgs/formToObject.png">

##### Contribute

<a href="https://github.com/serbanghita/formToObject/issues/new">Add an issue</a> or fork the project and submit a pull request. <br>
If this script helped you save a lot of developing time, I really appreciate any donations
<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=serbanghita%40gmail%2ecom&lc=US&item_name=Serban%20Ghita%20%28GitHub%29&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted"><img src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0"></a>.


