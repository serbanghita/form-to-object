(function(window, document, undefined){

	'use strict';

	var formToObject = function(){

		if (!(this instanceof formToObject)) {
			var test = new formToObject();
			return test.init.call(test, Array.prototype.slice.call(arguments));
		}

		var formRef   = null,
			keyRegex      = /[^\[\]]+|\[\]/g,
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
		this.addChild = function( result, $domNode, elementNameArray, value, parentKeyName ){

			// #1 - Single dimensional array.
			if(elementNameArray.length === 1){

				/*
				// We're only interested in the radio that is checked.
				if( $domNode.nodeName === 'INPUT' &&
					$domNode.type === 'radio' ) {
					if( $domNode.checked ){
						result[elementNameArray] = value;
						return value;
					} else {
						return;
					}
				}

				// Checkboxes are a special case. We have to grab each checked values
				// and put them into an array.
				if( $domNode.nodeName === 'INPUT' &&
					$domNode.type === 'checkbox' ) {

					if( $domNode.checked ){

						if( !result[elementNameArray] ){
							result[elementNameArray] = [];
						}
						return result[elementNameArray].push( value );

					} else {
						return;
					}

				}

				// Multiple select is a special case.
				// We have to grab each selected option and put them into an array.
				if( $domNode.nodeName === 'SELECT' &&
					$domNode.type === 'select-multiple' ) {

					result[elementNameArray] = [];
					var DOMchilds = $domNode.querySelectorAll('option[selected]');
					if( DOMchilds ){
						this.forEach(DOMchilds, function(child){
							result[elementNameArray].push( child.value );
						});
					}
					return;

				}
				*/

				if(elementNameArray[0] === '[]') {
					//console.log(elementNameArray[0], result);
					if( !(result instanceof Array) ){
						console.log('here', result);
						result = [];
					}
					result.push( value );

					return result;
				} else {
					// Fallback. The default one to one assign.
					result[elementNameArray[0]] = value;
					return result;
				}

			}

			// #2 - Multi dimensional array.
			if(elementNameArray.length > 1) {

				if(!result[elementNameArray[0]]){
					result[elementNameArray[0]] = [];
				}

				var nextelementNameArray = elementNameArray.splice(1, elementNameArray.length);

				return this.addChild(
										result[elementNameArray[0]],
										$domNode,
										nextelementNameArray,
										value,
										parentKeyName
									);

			}

			return result;

		};

		this.setFormObj = function(){

			var elementNameArray, i = 0;

			for(i = 0; i < $formElements.length; i++){
				// Ignore the element if the 'name' attribute is empty.
				// Ignore the 'disabled' elements.
				if( $formElements[i].name && !$formElements[i].disabled ) {
					elementNameArray = $formElements[i].name.match( keyRegex );
					console.log(elementNameArray);
					this.addChild(
									formObj,
									$formElements[i],
									elementNameArray,
									$formElements[i].value,
									null
								);
				}
			}

			return formObj;

		};

	};

	window.formToObject = formToObject;

})(window, document);
