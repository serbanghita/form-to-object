(function(){

    // Constructor.
	var formToObject = function( formId ){

		if(!formId || typeof formId !== 'string'){ return false; }

		this.keyRegex      = /[^\[\]]+/g;
		this.$form         = null;
		this.$formElements = [];
		this.formObj       = {};

		this.$form         = document.getElementById( formId );
		this.$formElements = this.$form.querySelectorAll('input, textarea, select');

        var test, i = 0;
		for(var i = 0; i < this.$formElements.length; i++){
			// Ignore the element if the 'name' attribute is empty.
			if( this.$formElements[i].name ) {
				test = this.$formElements[i].name.match( this.keyRegex );
				this.addChild( this.formObj, this.$formElements[i], test, this.$formElements[i].value );
			}
		}

		return this.formObj;

	};

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

			// Checkboxes are a special case. We have to grab each checked values
			// and put them into an array.
			if( domNode.nodeName === 'INPUT' && domNode.type === 'checkbox' ) {

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
			if( domNode.nodeName === 'SELECT' && domNode.type === 'select-multiple' ) {

				result[keys] = [];
				var DOMchilds = domNode.querySelectorAll('option[selected]');
				if( DOMchilds ){
					[].forEach.call(DOMchilds, function(child){
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

    // Expose the method.
	window.formToObject = formToObject;

})();