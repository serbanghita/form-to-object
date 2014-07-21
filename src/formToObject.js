(function(window, document, undefined){

	'use strict';

	var formToObject = function(){

		if (!(this instanceof formToObject)) {
			var test = new formToObject();
			return test.init.call(test, Array.prototype.slice.call(arguments));
		}

		var formRef   = null,
			keyRegex      = /[^\[\]]+/g,
			$form         = null,
			$formElements = [],
			formObj       = {};

		this.init = function(options){

			if(!options || typeof options !== 'object' || !options[0]){
				return false;
			}

			formRef = options[0];

			if( !this.setForm() ){
				return false;
			}
			if( !this.setFormElements() ){
				return false;
			}

			return this.setFormObj();
		};

		// Set the main form object we are working on.
		this.setForm = function(){

			switch( typeof formRef ){
			case 'string':
				$form = document.getElementById( formRef );
				break;

			case 'object':
				if( this.isDomNode(formRef) ){
					$form = formRef;
				}
				break;
			}

			return $form;

		};

		// Set the elements we need to parse.
		this.setFormElements = function(){
			$formElements = $form.querySelectorAll('input, textarea, select');
			return $formElements.length;
		};

		// Check to see if the object is a HTML node.
		this.isDomNode = function( node ){
			return typeof node === 'object' &&
					'nodeType' in node &&
					node.nodeType === 1;
		};

		// Iteration through arrays and objects. Compatible with IE.
		this.forEach = function( arr, callback ){

			if([].forEach){
				return [].forEach.call(arr, callback);
			}

			var i;
			for(i in arr){
				// Using Object.prototype.hasOwnProperty instead of
				// arr.hasOwnProperty for IE8 compatibility.
				if( Object.prototype.hasOwnProperty.call(arr,i) ){
					callback.call(arr, arr[i]);
				}
			}

			return;

		};

		// Recursive method that adds keys and values of the corresponding fields.
		this.addChild = function( result, domNode, keys, value ){

			// #1 - Single dimensional array.
			if(keys.length === 1){

				// We're only interested in the radio that is checked.
				if( domNode.nodeName === 'INPUT' &&
					domNode.type === 'radio' ) {
					if( domNode.checked ){
						result[keys] = value;
						return value;
					} else {
						return;
					}
				}

				// Checkboxes are a special case. We have to grab each checked values
				// and put them into an array.
				if( domNode.nodeName === 'INPUT' &&
					domNode.type === 'checkbox' ) {

					if( domNode.checked ){

						if( !result[keys] ){
							result[keys] = [];
						}
						return result[keys].push( value );

					} else {
						return;
					}

				}

				// Multiple select is a special case.
				// We have to grab each selected option and put them into an array.
				if( domNode.nodeName === 'SELECT' &&
					domNode.type === 'select-multiple' ) {

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

				return this.addChild(
										result[keys[0]],
										domNode,
										keys.splice(1, keys.length),
										value
									);

			}

			return result;

		};

		this.setFormObj = function(){

			var test, i = 0;

			for(i = 0; i < $formElements.length; i++){
				// Ignore the element if the 'name' attribute is empty.
				// Ignore the 'disabled' elements.
				if( $formElements[i].name && !$formElements[i].disabled ) {
					test = $formElements[i].name.match( keyRegex );
					this.addChild(
									formObj,
									$formElements[i],
									test,
									$formElements[i].value
								);
				}
			}

			return formObj;

		};

	};

	window.formToObject = formToObject;

})(window, document);
