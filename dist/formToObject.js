(function (window, document, undefined) {
  'use strict';

  var formToObject = function () {

    if (!(this instanceof formToObject)) {
      var test = new formToObject(); // jscs:ignore requireCapitalizedConstructors
      return test.init.call(test, Array.prototype.slice.call(arguments));
    }

    /**
     * Defaults
     */

    var formRef = null;

    // Experimental. Don't rely on them yet.
    var settings = {
      includeEmptyValuedElements: false,
      w3cSuccessfulControlsOnly: false
    };

    // Currently matching only '[]'.
    var keyRegex = /[^\[\]]+|\[\]/g;
    var $form = null;
    var $formElements = [];

    /**
     * Private methods
     */

    /**
     * Check to see if the object is a HTML node.
     *
     * @param {object} node
     * @returns {boolean}
     */
    function isDomElementNode(node) {
      return !!(node &&
        typeof node === 'object' &&
        'nodeType' in node &&
        node.nodeType === 1);
    }

    /**
     * Check for last numeric key.
     *
     * @param o object
     * @return mixed (string|undefined)
     */
    function checkForLastNumericKey(o) {
      if (!o || typeof o !== 'object') {
        return undefined;
      }

      return Object.keys(o).filter(function (elem) {
        return !isNaN(parseInt(elem, 10));
      }).splice(-1)[0];
    }

    /**
     * Get last numeric key from an object.
     * @param o object
     * @return int
     */
    function getLastIntegerKey(o) {
      var lastKeyIndex = checkForLastNumericKey(o);
      if (typeof lastKeyIndex === 'string') {
        return parseInt(lastKeyIndex, 10);
      } else {
        return 0;
      }
    }

    /**
     * Get the next numeric key (like the index from a PHP array)
     * @param o object
     * @return int
     */
    function getNextIntegerKey(o) {
      var lastKeyIndex = checkForLastNumericKey(o);
      if (typeof lastKeyIndex === 'string') {
        return parseInt(lastKeyIndex, 10) + 1;
      } else {
        return 0;
      }
    }

    /**
     * Get the real number of properties from an object.
     *
     * @param {object} o
     * @returns {number}
     */
    function getObjLength(o) {
      if (typeof o !== 'object' || o === null) {
        return 0;
      }

      var l = 0;
      var k;

      if (typeof Object.keys === 'function') {
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

    /**
     * Simple extend of own properties.
     * Needed for our settings.
     *
     * @param  {object} destination The object we want to extend.
     * @param  {object} sources The object with new properties that we want to add the the destination.
     * @return {object}
     */
    function extend(destination, sources) {
      var i;
      for (i in sources) {
        if (sources.hasOwnProperty(i)) {
          destination[i] = sources[i];
        }
      }

      return destination;
    }

    // Iteration through arrays and objects. Compatible with IE.
    function forEach(arr, callback) {
      if ([].forEach) {
        return [].forEach.call(arr, callback);
      }

      var i;
      for (i in arr) {
        // Using Object.prototype.hasOwnProperty instead of
        // arr.hasOwnProperty for IE8 compatibility.
        if (Object.prototype.hasOwnProperty.call(arr, i)) {
          callback.call(arr, arr[i]);
        }
      }

      return;
    }

    // Constructor
    function init(options) {
      // Assign the current form reference.
      if (!options || typeof options !== 'object' || !options[0]) {
        return false;
      }

      // The form reference is always the first parameter of the method.
      // Eg: formToObject('myForm')
      formRef = options[0];

      // Override current settings.
      // Eg. formToObject('myForm', {mySetting: true})
      if (typeof options[1] !== 'undefined' && getObjLength(options[1]) > 0) {
        extend(settings, options[1]);
      }

      if (!setForm()) {
        return false;
      }

      if (!setFormElements()) {
        return false;
      }

      return convertToObj();
    }

    // Set the main form object we are working on.
    function setForm() {
      switch (typeof formRef) {
      case 'string':
        $form = document.getElementById(formRef);
        break;

      case 'object':
        if (isDomElementNode(formRef)) {
          $form = formRef;
        }

        break;
      }

      return $form;
    }

    function isUploadForm() {
      return ($form.enctype && $form.enctype === 'multipart/form-data' ? true : false);
    }

    // Set the elements we need to parse.
    function setFormElements() {
      $formElements = $form.querySelectorAll('input, textarea, select');
      return $formElements.length;
    }

    function isRadio($domNode) {
      return $domNode.nodeName === 'INPUT' && $domNode.type === 'radio';
    }

    function isCheckbox($domNode) {
      return $domNode.nodeName === 'INPUT' && $domNode.type === 'checkbox';
    }

    function isFileField($domNode) {
      return $domNode.nodeName === 'INPUT' && $domNode.type === 'file';
    }

    function isTextarea($domNode) {
      return $domNode.nodeName === 'TEXTAREA';
    }

    function isSelectSimple($domNode) {
      return $domNode.nodeName === 'SELECT' && $domNode.type === 'select-one';
    }

    function isSelectMultiple($domNode) {
      return $domNode.nodeName === 'SELECT' && $domNode.type === 'select-multiple';
    }

    function isSubmitButton($domNode) {
      return $domNode.nodeName === 'BUTTON' && $domNode.type === 'submit';
    }

    function isChecked($domNode) {
      return $domNode.checked;
    }

    //function isMultiple($domNode){
    //  return ($domNode.multiple ? true : false);
    //}

    function isFileList($domNode) {
      return (window.FileList && $domNode.files instanceof window.FileList);
    }

    function getNodeValues($domNode) {
      // We're only interested in the radio that is checked.
      if (isRadio($domNode)) {
        return isChecked($domNode) ? $domNode.value : false;
      }

      // We're only interested in the checkbox that is checked.
      if (isCheckbox($domNode)) {
        return isChecked($domNode) ? $domNode.value : false;
      }

      // File inputs are a special case.
      // We have to grab the .files property of the input, which is a FileList.
      if (isFileField($domNode)) {
        // Ignore input file fields if the form is not encoded properly.
        if (isUploadForm()) {
          // HTML5 compatible browser.
          if (isFileList($domNode) && $domNode.files.length > 0) {
            return $domNode.files;
          } else {
            return ($domNode.value && $domNode.value !== '' ? $domNode.value : false);
          }
        } else {
          return false;
        }
      }

      // We're only interested in textarea fields that have values.
      if (isTextarea($domNode)) {
        return ($domNode.value && $domNode.value !== '' ? $domNode.value : false);
      }

      if (isSelectSimple($domNode)) {
        if ($domNode.value && $domNode.value !== '') {
          return $domNode.value;
        } else if ($domNode.options && $domNode.options.length && $domNode.options[0].value !== '') {
          return $domNode.options[0].value;
        } else {
          return false;
        }
      }

      // We're only interested in multiple selects that have at least one option selected.
      if (isSelectMultiple($domNode)) {
        if ($domNode.options && $domNode.options.length > 0) {
          var values = [];
          forEach($domNode.options, function ($option) {
            if ($option.selected) {
              values.push($option.value);
            }
          });

          if (settings.includeEmptyValuedElements) {
            return values;
          } else {
            return (values.length ? values : false);
          }

        } else {
          return false;
        }
      }

      // We're only interested if the button is type="submit"
      if (isSubmitButton($domNode)) {
        if ($domNode.value && $domNode.value !== '') {
          return $domNode.value;
        }

        if ($domNode.innerText && $domNode.innerText !== '') {
          return $domNode.innerText;
        }

        return false;
      }

      // Fallback or other non special fields.
      if (typeof $domNode.value !== 'undefined') {
        if (settings.includeEmptyValuedElements) {
          return $domNode.value;
        } else {
          return ($domNode.value !== '' ? $domNode.value : false);
        }
      } else {
        return false;
      }
    }

    function processSingleLevelNode($domNode, arr, domNodeValue, result) {
      // Get the last remaining key.
      var key = arr[0];

      // We're only interested in the radio that is checked.
      if (isRadio($domNode)) {
        if (domNodeValue !== false) {
          result[key] = domNodeValue;
          return domNodeValue;
        } else {
          return;
        }
      }

      // Checkboxes are a special case.
      // We have to grab each checked values
      // and put them into an array.
      if (isCheckbox($domNode)) {
        if (domNodeValue !== false) {
          if (!result[key]) {
            result[key] = [];
          }

          return result[key].push(domNodeValue);
        } else {
          return;
        }
      }

      // Multiple select is a special case.
      // We have to grab each selected option and put them into an array.
      if (isSelectMultiple($domNode)) {
        if (domNodeValue !== false) {
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

    function processMultiLevelNode($domNode, arr, value, result) {
      var keyName = arr[0];

      if (arr.length > 1) {
        if (keyName === '[]') {
          //result.push({});
          result[getNextIntegerKey(result)] = {};
          return processMultiLevelNode(
            $domNode,
            arr.splice(1, arr.length),
            value,
            result[getLastIntegerKey(result)]
          );
        } else {
          if (result[keyName] && getObjLength(result[keyName]) > 0) {
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
      if (arr.length === 1) {
        if (keyName === '[]') {
          //result.push(value);
          result[getNextIntegerKey(result)] = value;
          return result;
        } else {
          processSingleLevelNode($domNode, arr, value, result);

          //  result[keyName] = value;
          return result;
        }
      }
    }

    function convertToObj() {
      var i = 0;
      var objKeyNames;
      var $domNode;
      var domNodeValue;
      var result = {};
      var resultLength;

      for (i = 0; i < $formElements.length; i++) {

        $domNode = $formElements[i];

        // Skip the element if the 'name' attribute is empty.
        // Skip the 'disabled' elements.
        // Skip the non selected radio elements.
        if (!$domNode.name ||
          $domNode.name === '' ||
          $domNode.disabled ||
          (isRadio($domNode) && !isChecked($domNode))
        ) {
          continue;
        }

        // Get the final processed domNode value.
        domNodeValue = getNodeValues($domNode);

        // Exclude empty valued nodes if the settings allow it.
        if (domNodeValue === false && !settings.includeEmptyValuedElements) {
          continue;
        }

        // Extract all possible keys
        // Eg. name="firstName", name="settings[a][b]", name="settings[0][a]"
        objKeyNames = $domNode.name.match(keyRegex);

        if (objKeyNames.length === 1) {
          processSingleLevelNode(
            $domNode,
            objKeyNames, (domNodeValue ? domNodeValue : ''),
            result
          );
        }

        if (objKeyNames.length > 1) {
          processMultiLevelNode(
            $domNode,
            objKeyNames, (domNodeValue ? domNodeValue : ''),
            result
          );
        }

      }

      // Check the length of the result.
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

  if (typeof define === 'function' && define.amd) {
    // AMD/requirejs: Define the module
    define(function () {
      return formToObject;
    });
  } else {
    // Browser: Expose to window
    window.formToObject = formToObject;
  }

})(window, document);
