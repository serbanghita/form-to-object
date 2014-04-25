/*! github.com/serbanghita/formToObject.js 1.0.1  (c) 2013 Serban Ghita <serbanghita@gmail.com> @licence MIT */

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
	formToObject.prototype.addChild = function( result, domNode, keys, value ){

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

			// if single dimension array get only the value of the checkbox checked
			if( domNode.nodeName === 'INPUT' && domNode.type === 'checkbox' ) {
                                if( domNode.checked ){
                                    return result[keys] = value;
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

			return this.addChild(result[keys[0]], domNode, keys.splice(1, keys.length), value);

		}

		return result;

	};

	formToObject.prototype.setFormObj = function(){

		var test, i = 0;

		for(i = 0; i < this.$formElements.length; i++){
			// Ignore the element if the 'name' attribute is empty.
			// Ignore the 'disabled' elements.
			if( this.$formElements[i].name && !this.$formElements[i].disabled ) {
				test = this.$formElements[i].name.match( this.keyRegex );
				this.addChild( this.formObj, this.$formElements[i], test, this.$formElements[i].value );
			}
		}

		return this.formObj;

	}

	// AMD/requirejs: Define the module
	if( typeof define === 'function' && define.amd ) {
		define(function () {
			return formToObject;
		});
	}
	// Browser: Expose to window
	else {
		window.formToObject = formToObject;
	}

})();
