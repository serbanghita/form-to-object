/*
MIT License
===========

Copyright (c) 2013 Serban Ghita <serbanghita@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
*/

(function(){

    // Constructor.
	var formToObject = function( formRef ){

		if( !formRef ){ return false; }

		this.formRef       = formRef;
		this.keyRegex      = /[^\[\]]+/g;
		this.$form         = null;
		this.$formElements = [];
		this.formObj       = {};

		if( !this.setForm() ){ return false; }
		if( !this.setFormElements() ){ return false; }

		return this.setFormObj();

	};

	// Set the main form object we are working on.
	formToObject.prototype.setForm = function(){

		switch( typeof this.formRef ){

			case 'string':
				this.$form = document.getElementById( this.formRef );
			break;

			case 'object':
				if( this.isDomNode(this.formRef) ){
					this.$form = this.formRef;
				}
			break;

		}

		return this.$form;

	};

	// Set the elements we need to parse.
	formToObject.prototype.setFormElements = function(){
		this.$formElements = this.$form.querySelectorAll('input, textarea, select');
		return this.$formElements.length;
	};

	// Check to see if the object is a HTML node.
	formToObject.prototype.isDomNode = function( node ){
		return typeof node === "object" && "nodeType" in node && node.nodeType === 1;
	};

	// Iteration through arrays and objects. Compatible with IE.
	formToObject.prototype.forEach = function( arr, callback ){

		if([].forEach){
			return [].forEach.call(arr, callback);
		}

		var i;
		for(i in arr){
			// Object.prototype.hasOwnProperty instead of arr.hasOwnProperty for IE8 compatibility.
			if( Object.prototype.hasOwnProperty.call(arr,i) ){
				callback.call(arr, arr[i]);
			}
		}

		return;

	}

        // Recursive method that adds keys and values of the corresponding fields.
	formToObject.prototype.addChild = function( result, domNode, keys, value, isArray ){
		// #1 - Single dimensional array.
		if(keys.length === 1){

			// We're only interested in the radio that is checked.
			if( domNode.nodeName === 'INPUT' && domNode.type === 'radio' ) {
				if( domNode.checked ){
					return result[keys] = value;
				} else {
					return;
				}
			}

			// only the value of the checkbox checked
			if( domNode.nodeName === 'INPUT' && domNode.type === 'checkbox' ) {
                                if( domNode.checked ){
                                    if (isArray) {
                                        if( !result[keys] ){
                                            result[keys] = [];
                                        }
                                        return result[keys].push( value );
                                    } else {
                                        return result[keys] = value;
                                    }
				} else {
					return;
				}
			}

			// Multiple select is a special case.
			// We have to grab each selected option and put them into an array.
			if( domNode.nodeName === 'SELECT' && domNode.type === 'select-multiple' ) {

				result[keys] = [];
				var DOMchilds = domNode.querySelectorAll('option[selected]');
				if( DOMchilds ){
					this.forEach(DOMchilds, function(child){
						result[keys].push( child.value );
					});
				}
				return;

			}

			// Fallback. The default one to one assign.
			result[keys] = value;

		}

		// #2 - Multi dimensional array.
		if(keys.length > 1) {

			if(!result[keys[0]]){
				result[keys[0]] = {};
			}

			return this.addChild(result[keys[0]], domNode, keys.splice(1, keys.length), value, isArray);

		}

		return result;

	};

	formToObject.prototype.setFormObj = function(){

		var test, i = 0, isArray = false;

		for(i = 0; i < this.$formElements.length; i++){
			// Ignore the element if the 'name' attribute is empty.
			// Ignore the 'disabled' elements.
			if( this.$formElements[i].name && !this.$formElements[i].disabled ) {
				test = this.$formElements[i].name.match( this.keyRegex );
				isArray = this.endsWith(this.$formElements[i].name, '[]');
				this.addChild( this.formObj, this.$formElements[i], test, this.$formElements[i].value, isArray );
			}
		}

		return this.formObj;

	}

        formToObject.prototype.endsWith = function(string, suffix) {
            return string.indexOf(suffix, this.length - suffix.length) !== -1;
        }

        // Expose the method.
	window.formToObject = formToObject;

})();
