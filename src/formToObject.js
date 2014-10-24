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
			// @todo Experimental. Don't rely on them yet.
			settings = {
				includeEmptyValuedElements: false,
				w3cSuccesfulControlsOnly: false
			},
			// Currently matching only '[]'.
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

		/**
		 * Check for last numeric key.
		 * 
		 * @param  Object o
		 * @return mixed (string|undefined)
		 */
		function checkForLastNumericKey(o){
			return Object.keys(o).filter(function(elem){ 
				return !isNaN(parseInt(elem,10)); 
			}).splice(-1)[0];
		}

		/**
		 * Get last numeric key from an object.
		 * @param  Object o
		 * @return integer
		 */
		function getLastIntegerKey(o){
			var lastKeyIndex = checkForLastNumericKey(o);
			return parseInt(lastKeyIndex,10);
		}	

		/**
		 * Get the next numeric key (like the index from a PHP array)
		 * @param  Object o
		 * @return integer
		 */
		function getNextIntegerKey(o){
			var lastKeyIndex = checkForLastNumericKey(o);
			if(typeof lastKeyIndex === 'undefined'){
				return 0;
			} else {
				return parseInt(lastKeyIndex,10) + 1;
			}
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

		// Iteration through arrays and objects. Compatible with IE.
		function forEach( arr, callback ){

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

		function isRadio($domNode){
			return $domNode.nodeName === 'INPUT' && $domNode.type === 'radio';
		}

		function isCheckbox($domNode){
			return $domNode.nodeName === 'INPUT' && $domNode.type === 'checkbox';
		}

		function isTextarea($domNode){
			return $domNode.nodeName === 'TEXTAREA';
		}

		function isSelectMultiple($domNode){
			return $domNode.nodeName === 'SELECT' && $domNode.type === 'select-multiple';
		}

		function isSubmitButton($domNode){
			return $domNode.nodeName === 'BUTTON' && $domNode.type === 'submit';
		}

		function getNodeValues($domNode){

			// We're only interested in the radio that is checked.
			if( isRadio($domNode) ){
				return $domNode.checked ? $domNode.value : false;
			}

			// We're only interested in the checkbox that is checked.
			if( isCheckbox($domNode) ){
				return $domNode.checked ? $domNode.value : false;
			}			

			// We're only interested in textarea fields that have values.
			if( isTextarea($domNode) ){
				return ($domNode.value && $domNode.value !== '' ? $domNode.value : false);
			}

			// We're only interested in multiple selects that have at least one option selected.
			if( isSelectMultiple($domNode) ){
				if($domNode.options && $domNode.options.length > 0) {
					var values = [];
					forEach($domNode.options, function($option){
						if($option.selected){
							values.push($option.value);
						}
					});
					if( settings.includeEmptyValuedElements ){
						return values;
					} else {
						return (values.length ? values : false);
					}
					
				} else {
					return false;
				}
			}

			// We're only interested if the button is type="submit"
			if( isSubmitButton($domNode) ){
				if($domNode.value && $domNode.value !== ''){
					return $domNode.value;
				}
				if($domNode.innerText && $domNode.innerText !== ''){
					return $domNode.innerText;
				}
				return false;
			}

			// Fallback or other non special fields.
			if( typeof $domNode.value !== 'undefined' ){
				if( settings.includeEmptyValuedElements ){
					return $domNode.value;
				} else {
					return ($domNode.value !== '');
				}
			} else {
				return false;
			}

		}

		function processSingleLevelNode($domNode, arr, domNodeValue, result){

			// Get the last remaining key.
			var key = arr[0];

			// We're only interested in the radio that is checked.
			if( isRadio($domNode) ){
				if( domNodeValue !== false ){
					result[key] = domNodeValue;
					return domNodeValue;
				} else {
					return;
				}
			}

			// Checkboxes are a special case. 
			// We have to grab each checked values
			// and put them into an array.
			if( isCheckbox($domNode) ){
				if( domNodeValue !== false ){
					if( !result[key] ){
						result[key] = [];
					}
					return result[key].push( domNodeValue );
				} else {
					return;
				}			
			}

			// Multiple select is a special case.
			// We have to grab each selected option and put them into an array.
			if( isSelectMultiple($domNode) ){
				if( domNodeValue !== false ){
					result[key] = domNodeValue;
				} else {
					return;
				}
			}

			// Fallback or other cases that don't
			// need special treatment of the value.
			result[key] = domNodeValue;

			return domNodeValue;

		}

		function processMultiLevelNode($domNode, arr, value, result){

			var keyName = arr[0];

			if(arr.length > 1){
				if( keyName === '[]' ){ 
					//result.push({});
					result[getNextIntegerKey(result)] = {};
					return processMultiLevelNode(
													$domNode, 
													arr.splice(1, arr.length), 
													value, 
													result[getLastIntegerKey(result)]
												);
				} else {
					if( result[keyName] && getObjLength(result[keyName]) > 0 ) {
						//result[keyName].push(null);
						return processMultiLevelNode(
														$domNode, 
														arr.splice(1, arr.length), 
														value, 
														result[keyName]
													);
					} else {
						result[keyName] = {};				
					}	
					return processMultiLevelNode($domNode, arr.splice(1, arr.length), value, result[keyName]);
				}				
			}

			// Last key, attach the original value.
			if(arr.length === 1){
				if( keyName === '[]' ){
					//result.push(value);
					result[getNextIntegerKey(result)] = value;
					return result;
				} else {
					processSingleLevelNode($domNode, arr, value, result);
					//	result[keyName] = value;
					return result;
				}
			}

		}

		function convertToObj(){

			var i = 0, 
				objKeyNames,
				$domNode,
				domNodeValue,
				result = {},
				resultLength = 0;

			for(i = 0; i < $formElements.length; i++){
				
				$domNode = $formElements[i];

				// Ignore the element if the 'name' attribute is empty.
				// Ignore the 'disabled' elements.
				if( $domNode.name && !$domNode.disabled ) {

					// Get the final processed domNode value.
					domNodeValue = getNodeValues($domNode);

					// Exclude empty valued nodes if the settings allow it.
					if( domNodeValue === false && !settings.includeEmptyValuedElements ){
						continue;
					}

					// Extract all possible keys 
					// Eg. name="firstName", name="settings[a][b]", name="settings[0][a]"
					objKeyNames = $domNode.name.match( keyRegex );

					if( objKeyNames.length === 1 ) {
						processSingleLevelNode($domNode, objKeyNames, (domNodeValue ? domNodeValue : ''), result);
					}
					if( objKeyNames.length > 1 ){												
						processMultiLevelNode($domNode, objKeyNames, (domNodeValue ? domNodeValue : ''), result);
					}
				}

			}

			// Check the legth of the result.
			resultLength = getObjLength(result);

			return resultLength > 0 ? result : false;

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