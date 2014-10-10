(function(window, document, undefined){

	'use strict';

	var formToObject = function(){

		if (!(this instanceof formToObject)) {
			var test = new formToObject();
			return test.init.call(test, Array.prototype.slice.call(arguments));
		}

		/**
		* Defaults
		*/
		var formRef   = null,
			keyRegex      = /[^\[\]]+|\[\]/g,
			$form         = null,
			$formElements = [];

		/**
		 * Private methods
		 */
		
		// Check to see if the object is a HTML node.
		function isDomNode( node ){
			return typeof node === 'object' &&
					'nodeType' in node &&
					node.nodeType === 1;
		}

		// Get last numeric key from an object.
		function getLastNumericKey(o){
			return Object.keys(o).filter(function(elem){ 
				return !isNaN(parseInt(elem,10)); 
			}).splice(-1)[0];
		}	

		// Get the real number of properties from an object.
		function getObjLength(o){

			var l, k;

			if( typeof Object.keys === 'function' ) {
				l = Object.keys(o).length;
			} else {
				for (k in o) {
				  if (o.hasOwnProperty(k)) { 
				  	l++;
				  }
				}		
			}

			return l;

		}			

		// Constructor
		function init(options){

			if(!options || typeof options !== 'object' || !options[0]){
				return false;
			}

			formRef = options[0];

			if( !setForm() ){
				return false;
			}
			if( !setFormElements() ){
				return false;
			}

			return convertToObj();
		}

		// Set the main form object we are working on.
		function setForm(){

			switch( typeof formRef ){
			case 'string':
				$form = document.getElementById( formRef );
				break;

			case 'object':
				if( isDomNode(formRef) ){
					$form = formRef;
				}
				break;
			}

			return $form;

		}

		// Set the elements we need to parse.
		function setFormElements(){

			$formElements = $form.querySelectorAll('input, textarea, select');
			return $formElements.length;

		}

		function processNode(arr, value, result){

			var keyName = arr[0];

			if(arr.length > 1){
				if( keyName === '[]' ){ 
					result.push([]);
					return processNode(arr.splice(1, arr.length), value, result[getLastNumericKey(result)]);
				} else {

					if( result[keyName] && getObjLength(result[keyName]) > 0 ) {
						//result[keyName].push(null);
						return processNode(arr.splice(1, arr.length), value, result[keyName]); 
					} else {
						result[keyName] = [];				
					}	
					return processNode(arr.splice(1, arr.length), value, result[keyName]);		
				}
				
			}

			// Last key, attach the original value.
			if(arr.length === 1){
				if( keyName === '[]' ){
					result.push(value);
					return result;
				} else {
					result[keyName] = value;
					return result;
				}
			}

		}

		function convertToObj(){

			var i = 0, 
				objKeyNames, 
				result = [];

			for(i = 0; i < $formElements.length; i++){
				// Ignore the element if the 'name' attribute is empty.
				// Ignore the 'disabled' elements.
				if( $formElements[i].name && !$formElements[i].disabled ) {
					objKeyNames = $formElements[i].name.match( keyRegex );
					if( objKeyNames.length > 0 ){
						processNode(objKeyNames, $formElements[i].value, result);
					}
				}
			}

			return result;

		}

		/**
		 * Expose public methods.
		 */
		return {
			init: init
		};

	};

	/**
	 * Expose the final class.
	 * @type Function
	 */
	window.formToObject = formToObject;

})(window, document);
