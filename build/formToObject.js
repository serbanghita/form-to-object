/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core.ts":
/*!*********************!*\
  !*** ./src/core.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.init = void 0;
var functions_1 = __webpack_require__(/*! ./functions */ "./src/functions.ts");
/**
 * Defaults
 */
var formRef;
// Experimental. Don't rely on them yet.
var settings = {
    includeEmptyValuedElements: false,
    w3cSuccessfulControlsOnly: false
};
// Currently matching only fields like 'fieldName[...] or fieldName[]'.
var keyRegex = /[^[\]]+|\[]/g;
var $form;
var $formElements;
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
    if (typeof options[1] !== 'undefined' && (0, functions_1.getObjLength)(options[1]) > 0) {
        (0, functions_1.extend)(settings, options[1]);
    }
    if (!setForm()) {
        return false;
    }
    if (!setFormElements()) {
        return false;
    }
    return convertToObj();
}
exports.init = init;
// Set the main form object we are working on.
function setForm() {
    switch (typeof formRef) {
        case 'string':
            $form = document.getElementById(formRef);
            break;
        case 'object':
            if ((0, functions_1.isDomElementNode)(formRef)) {
                $form = formRef;
            }
            break;
    }
    return $form;
}
function isUploadForm() {
    return Boolean($form.enctype && $form.enctype === 'multipart/form-data');
}
// Set the elements we need to parse.
function setFormElements() {
    $formElements = $form.querySelectorAll('input, textarea, select');
    return $formElements.length;
}
function nodeHasSiblings($domNode) {
    var name = $domNode.name;
    return Array.prototype.filter.call($formElements, function (input) { return input.name === name; }).length > 1;
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
    return (window.FileList && ($domNode.files instanceof window.FileList));
}
function getNodeValues($domNode) {
    var _a;
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
            if (isFileList($domNode) && ((_a = $domNode === null || $domNode === void 0 ? void 0 : $domNode.files) === null || _a === void 0 ? void 0 : _a.length)) {
                return $domNode.files;
            }
            else {
                return ($domNode.value && $domNode.value !== '' ?
                    $domNode.value :
                    false);
            }
        }
        else {
            return false;
        }
    }
    // We're only interested in textarea fields that have values.
    if (isTextarea($domNode)) {
        return ($domNode.value && $domNode.value !== '' ?
            $domNode.value :
            false);
    }
    if (isSelectSimple($domNode)) {
        if ($domNode.value && $domNode.value !== '') {
            return $domNode.value;
        }
        else if ($domNode.options &&
            $domNode.options.length &&
            $domNode.options[0].value !== '') {
            return $domNode.options[0].value;
        }
        else {
            return false;
        }
    }
    // We're only interested in multiple selects that have at least one option selected.
    if (isSelectMultiple($domNode)) {
        if ($domNode.options && $domNode.options.length > 0) {
            var values_1 = [];
            (0, functions_1.forEach)($domNode.options, function ($option) {
                if ($option.selected) {
                    values_1.push($option.value);
                }
            });
            if (settings.includeEmptyValuedElements) {
                return values_1;
            }
            else {
                return (values_1.length ? values_1 : false);
            }
        }
        else {
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
    // Fallback or other non-special fields.
    if (typeof $domNode.value !== 'undefined') {
        if (settings.includeEmptyValuedElements) {
            return $domNode.value;
        }
        else {
            return ($domNode.value !== '' ? $domNode.value : false);
        }
    }
    else {
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
        }
        else {
            return;
        }
    }
    // Checkboxes are a special case.
    // We have to grab each checked values
    // and put them into an array.
    if (isCheckbox($domNode)) {
        if (domNodeValue !== false) {
            if (nodeHasSiblings($domNode)) {
                if (!result[key]) {
                    result[key] = [];
                }
                return result[key].push(domNodeValue);
            }
            else {
                result[key] = domNodeValue;
            }
        }
        else {
            return;
        }
    }
    // Multiple select is a special case.
    // We have to grab each selected option and put them into an array.
    if (isSelectMultiple($domNode)) {
        if (domNodeValue !== false) {
            result[key] = domNodeValue;
        }
        else {
            return;
        }
    }
    // Fallback or other cases that don't
    // need special treatment of the value.
    result[key] = domNodeValue;
    return domNodeValue;
}
// interface NodeResult extends Record<string, NodeResult> {}
function processMultiLevelNode($domNode, arr, value, result) {
    var keyName = arr[0];
    if (arr.length > 1) {
        if (keyName === '[]') {
            //result.push({});
            result[(0, functions_1.getNextIntegerKey)(result)] = Object.create(null);
            return processMultiLevelNode($domNode, arr.splice(1, arr.length), value, result[(0, functions_1.getLastIntegerKey)(result)]);
        }
        else {
            if (result[keyName] && (0, functions_1.getObjLength)(result[keyName]) > 0) {
                //result[keyName].push(null);
                return processMultiLevelNode($domNode, arr.splice(1, arr.length), value, result[keyName]);
            }
            else {
                result[keyName] = Object.create(null);
            }
            return processMultiLevelNode($domNode, arr.splice(1, arr.length), value, result[keyName]);
        }
    }
    // Last key, attach the original value.
    if (arr.length === 1) {
        if (keyName === '[]') {
            //result.push(value);
            result[(0, functions_1.getNextIntegerKey)(result)] = value;
            return result;
        }
        else {
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
    for (i = 0; i < $formElements.length; i++) {
        $domNode = $formElements[i];
        // Skip the element if the 'name' attribute is empty.
        // Skip the 'disabled' elements.
        // Skip the non-selected radio elements.
        if (!$domNode.name ||
            $domNode.name === '' ||
            $domNode.disabled ||
            (isRadio($domNode) && !isChecked($domNode))) {
            continue;
        }
        // Get the final processed domNode value.
        domNodeValue = getNodeValues($domNode);
        // Exclude empty valued nodes if the settings allow it.
        if (domNodeValue === false && !settings.includeEmptyValuedElements) {
            continue;
        }
        // Extract all possible keys
        // E.g. name="firstName", name="settings[a][b]", name="settings[0][a]"
        objKeyNames = $domNode.name.match(keyRegex);
        if (objKeyNames && objKeyNames.length === 1) {
            processSingleLevelNode($domNode, objKeyNames, (domNodeValue ? domNodeValue : ''), result);
        }
        if (objKeyNames && objKeyNames.length > 1) {
            processMultiLevelNode($domNode, objKeyNames, (domNodeValue ? domNodeValue : ''), result);
        }
    }
    // Check the length of the result.
    var resultLength = (0, functions_1.getObjLength)(result);
    return resultLength > 0 ? result : false;
}


/***/ }),

/***/ "./src/expose-to-browser.ts":
/*!**********************************!*\
  !*** ./src/expose-to-browser.ts ***!
  \**********************************/
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;
Object.defineProperty(exports, "__esModule", ({ value: true }));
var core_1 = __webpack_require__(/*! ./core */ "./src/core.ts");
(function (window) {
    'use strict';
    var formToObject = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return core_1.init.apply(void 0, args);
    };
    /**
     * Expose the final class.
     * @type Function
     */
    if ( true && (__webpack_require__.amdD === null || __webpack_require__.amdD === void 0 ? void 0 : __webpack_require__.amdO)) {
        // AMD/requirejs: Define the module
        !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
            return formToObject;
        }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
    else if ( true && (module === null || module === void 0 ? void 0 : module.exports)) {
        module.exports = formToObject;
    }
    else {
        // Browser: Expose to window
        window['formToObject'] = formToObject;
    }
})(window);


/***/ }),

/***/ "./src/functions.ts":
/*!**************************!*\
  !*** ./src/functions.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


/**
 * Private methods
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.forEach = exports.extend = exports.getObjLength = exports.getNextIntegerKey = exports.getLastIntegerKey = exports.checkForLastNumericKey = exports.isDomElementNode = void 0;
/**
 * Check to see if the object is an HTML node.
 *
 * @param {HTMLFormElement | HTMLElement} node
 * @returns {boolean}
 */
function isDomElementNode(node) {
    return (node && typeof node === 'object' && 'nodeType' in node && node.nodeType === 1);
}
exports.isDomElementNode = isDomElementNode;
/**
 * Check for last numeric key.
 */
function checkForLastNumericKey(o) {
    if (!o || typeof o !== 'object') {
        return;
    }
    return Object.keys(o).filter(function (elem) {
        return !isNaN(parseInt(elem, 10));
    }).splice(-1)[0];
}
exports.checkForLastNumericKey = checkForLastNumericKey;
/**
 * Get last numeric key from an object.
 * @param o object
 * @return int
 */
function getLastIntegerKey(o) {
    var lastKeyIndex = checkForLastNumericKey(o);
    if (typeof lastKeyIndex === 'string') {
        return parseInt(lastKeyIndex, 10);
    }
    else {
        return 0;
    }
}
exports.getLastIntegerKey = getLastIntegerKey;
/**
 * Get the next numeric key (like the index from a PHP array)
 * @param o object
 * @return int
 */
function getNextIntegerKey(o) {
    var lastKeyIndex = checkForLastNumericKey(o);
    if (typeof lastKeyIndex === 'string') {
        return parseInt(lastKeyIndex, 10) + 1;
    }
    else {
        return 0;
    }
}
exports.getNextIntegerKey = getNextIntegerKey;
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
    }
    else {
        for (k in o) {
            if (Object.prototype.hasOwnProperty.call(o, k)) {
                l++;
            }
        }
    }
    return l;
}
exports.getObjLength = getObjLength;
/**
 * Simple extend of own properties.
 * Needed for our settings.
 *
 * @param {ISettings} settings
 * @param  {ISettings} source The object with new properties that we want to add the destination.
 * @return {ISettings}
 */
function extend(settings, source) {
    var i;
    for (i in source) {
        if (Object.prototype.hasOwnProperty.call(source, i)) {
            settings[i] = source[i];
        }
    }
    return settings;
}
exports.extend = extend;
// Iteration through collections. Compatible with IE.
function forEach(arr, callback) {
    return Array.prototype.forEach.call(arr, callback);
}
exports.forEach = forEach;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/amd define */
/******/ 	(() => {
/******/ 		__webpack_require__.amdD = function () {
/******/ 			throw new Error('define cannot be used indirect');
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/amd options */
/******/ 	(() => {
/******/ 		__webpack_require__.amdO = {};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/expose-to-browser.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybVRvT2JqZWN0LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxZQUFZO0FBQ1osa0JBQWtCLG1CQUFPLENBQUMsdUNBQWE7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxnQkFBZ0I7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5RUFBeUUsNkJBQTZCO0FBQ3RHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLDBCQUEwQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2hUQSxrQ0FBYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxhQUFhLG1CQUFPLENBQUMsNkJBQVE7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsdUJBQXVCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLEtBQTRCLEtBQUssd0JBQU0sYUFBYSx3QkFBTSx1QkFBdUIsd0JBQVU7QUFDbkc7QUFDQSxRQUFRLG1DQUFPO0FBQ2Y7QUFDQSxTQUFTO0FBQUEsa0dBQUM7QUFDVjtBQUNBLGFBQWEsS0FBMEI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7QUM3Qlk7QUFDYjtBQUNBO0FBQ0E7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsZUFBZSxHQUFHLGNBQWMsR0FBRyxvQkFBb0IsR0FBRyx5QkFBeUIsR0FBRyx5QkFBeUIsR0FBRyw4QkFBOEIsR0FBRyx3QkFBd0I7QUFDM0s7QUFDQTtBQUNBO0FBQ0EsV0FBVywrQkFBK0I7QUFDMUMsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsV0FBVztBQUN0QixZQUFZLFdBQVc7QUFDdkIsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTs7Ozs7OztVQ3pHZjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDekJBO1dBQ0E7V0FDQTs7Ozs7V0NGQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztVRUpBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZm9ybV90b19vYmplY3QvLi9zcmMvY29yZS50cyIsIndlYnBhY2s6Ly9mb3JtX3RvX29iamVjdC8uL3NyYy9leHBvc2UtdG8tYnJvd3Nlci50cyIsIndlYnBhY2s6Ly9mb3JtX3RvX29iamVjdC8uL3NyYy9mdW5jdGlvbnMudHMiLCJ3ZWJwYWNrOi8vZm9ybV90b19vYmplY3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZm9ybV90b19vYmplY3Qvd2VicGFjay9ydW50aW1lL2FtZCBkZWZpbmUiLCJ3ZWJwYWNrOi8vZm9ybV90b19vYmplY3Qvd2VicGFjay9ydW50aW1lL2FtZCBvcHRpb25zIiwid2VicGFjazovL2Zvcm1fdG9fb2JqZWN0L3dlYnBhY2svcnVudGltZS9ub2RlIG1vZHVsZSBkZWNvcmF0b3IiLCJ3ZWJwYWNrOi8vZm9ybV90b19vYmplY3Qvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9mb3JtX3RvX29iamVjdC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vZm9ybV90b19vYmplY3Qvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pbml0ID0gdm9pZCAwO1xudmFyIGZ1bmN0aW9uc18xID0gcmVxdWlyZShcIi4vZnVuY3Rpb25zXCIpO1xuLyoqXG4gKiBEZWZhdWx0c1xuICovXG52YXIgZm9ybVJlZjtcbi8vIEV4cGVyaW1lbnRhbC4gRG9uJ3QgcmVseSBvbiB0aGVtIHlldC5cbnZhciBzZXR0aW5ncyA9IHtcbiAgICBpbmNsdWRlRW1wdHlWYWx1ZWRFbGVtZW50czogZmFsc2UsXG4gICAgdzNjU3VjY2Vzc2Z1bENvbnRyb2xzT25seTogZmFsc2Vcbn07XG4vLyBDdXJyZW50bHkgbWF0Y2hpbmcgb25seSBmaWVsZHMgbGlrZSAnZmllbGROYW1lWy4uLl0gb3IgZmllbGROYW1lW10nLlxudmFyIGtleVJlZ2V4ID0gL1teW1xcXV0rfFxcW10vZztcbnZhciAkZm9ybTtcbnZhciAkZm9ybUVsZW1lbnRzO1xuLy8gQ29uc3RydWN0b3JcbmZ1bmN0aW9uIGluaXQob3B0aW9ucykge1xuICAgIC8vIEFzc2lnbiB0aGUgY3VycmVudCBmb3JtIHJlZmVyZW5jZS5cbiAgICBpZiAoIW9wdGlvbnMgfHwgdHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnIHx8ICFvcHRpb25zWzBdKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gVGhlIGZvcm0gcmVmZXJlbmNlIGlzIGFsd2F5cyB0aGUgZmlyc3QgcGFyYW1ldGVyIG9mIHRoZSBtZXRob2QuXG4gICAgLy8gRWc6IGZvcm1Ub09iamVjdCgnbXlGb3JtJylcbiAgICBmb3JtUmVmID0gb3B0aW9uc1swXTtcbiAgICAvLyBPdmVycmlkZSBjdXJyZW50IHNldHRpbmdzLlxuICAgIC8vIEVnLiBmb3JtVG9PYmplY3QoJ215Rm9ybScsIHtteVNldHRpbmc6IHRydWV9KVxuICAgIGlmICh0eXBlb2Ygb3B0aW9uc1sxXSAhPT0gJ3VuZGVmaW5lZCcgJiYgKDAsIGZ1bmN0aW9uc18xLmdldE9iakxlbmd0aCkob3B0aW9uc1sxXSkgPiAwKSB7XG4gICAgICAgICgwLCBmdW5jdGlvbnNfMS5leHRlbmQpKHNldHRpbmdzLCBvcHRpb25zWzFdKTtcbiAgICB9XG4gICAgaWYgKCFzZXRGb3JtKCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIXNldEZvcm1FbGVtZW50cygpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbnZlcnRUb09iaigpO1xufVxuZXhwb3J0cy5pbml0ID0gaW5pdDtcbi8vIFNldCB0aGUgbWFpbiBmb3JtIG9iamVjdCB3ZSBhcmUgd29ya2luZyBvbi5cbmZ1bmN0aW9uIHNldEZvcm0oKSB7XG4gICAgc3dpdGNoICh0eXBlb2YgZm9ybVJlZikge1xuICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgICAgJGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChmb3JtUmVmKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICAgICAgaWYgKCgwLCBmdW5jdGlvbnNfMS5pc0RvbUVsZW1lbnROb2RlKShmb3JtUmVmKSkge1xuICAgICAgICAgICAgICAgICRmb3JtID0gZm9ybVJlZjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gJGZvcm07XG59XG5mdW5jdGlvbiBpc1VwbG9hZEZvcm0oKSB7XG4gICAgcmV0dXJuIEJvb2xlYW4oJGZvcm0uZW5jdHlwZSAmJiAkZm9ybS5lbmN0eXBlID09PSAnbXVsdGlwYXJ0L2Zvcm0tZGF0YScpO1xufVxuLy8gU2V0IHRoZSBlbGVtZW50cyB3ZSBuZWVkIHRvIHBhcnNlLlxuZnVuY3Rpb24gc2V0Rm9ybUVsZW1lbnRzKCkge1xuICAgICRmb3JtRWxlbWVudHMgPSAkZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCwgdGV4dGFyZWEsIHNlbGVjdCcpO1xuICAgIHJldHVybiAkZm9ybUVsZW1lbnRzLmxlbmd0aDtcbn1cbmZ1bmN0aW9uIG5vZGVIYXNTaWJsaW5ncygkZG9tTm9kZSkge1xuICAgIHZhciBuYW1lID0gJGRvbU5vZGUubmFtZTtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmZpbHRlci5jYWxsKCRmb3JtRWxlbWVudHMsIGZ1bmN0aW9uIChpbnB1dCkgeyByZXR1cm4gaW5wdXQubmFtZSA9PT0gbmFtZTsgfSkubGVuZ3RoID4gMTtcbn1cbmZ1bmN0aW9uIGlzUmFkaW8oJGRvbU5vZGUpIHtcbiAgICByZXR1cm4gJGRvbU5vZGUubm9kZU5hbWUgPT09ICdJTlBVVCcgJiYgJGRvbU5vZGUudHlwZSA9PT0gJ3JhZGlvJztcbn1cbmZ1bmN0aW9uIGlzQ2hlY2tib3goJGRvbU5vZGUpIHtcbiAgICByZXR1cm4gJGRvbU5vZGUubm9kZU5hbWUgPT09ICdJTlBVVCcgJiYgJGRvbU5vZGUudHlwZSA9PT0gJ2NoZWNrYm94Jztcbn1cbmZ1bmN0aW9uIGlzRmlsZUZpZWxkKCRkb21Ob2RlKSB7XG4gICAgcmV0dXJuICRkb21Ob2RlLm5vZGVOYW1lID09PSAnSU5QVVQnICYmICRkb21Ob2RlLnR5cGUgPT09ICdmaWxlJztcbn1cbmZ1bmN0aW9uIGlzVGV4dGFyZWEoJGRvbU5vZGUpIHtcbiAgICByZXR1cm4gJGRvbU5vZGUubm9kZU5hbWUgPT09ICdURVhUQVJFQSc7XG59XG5mdW5jdGlvbiBpc1NlbGVjdFNpbXBsZSgkZG9tTm9kZSkge1xuICAgIHJldHVybiAkZG9tTm9kZS5ub2RlTmFtZSA9PT0gJ1NFTEVDVCcgJiYgJGRvbU5vZGUudHlwZSA9PT0gJ3NlbGVjdC1vbmUnO1xufVxuZnVuY3Rpb24gaXNTZWxlY3RNdWx0aXBsZSgkZG9tTm9kZSkge1xuICAgIHJldHVybiAkZG9tTm9kZS5ub2RlTmFtZSA9PT0gJ1NFTEVDVCcgJiYgJGRvbU5vZGUudHlwZSA9PT0gJ3NlbGVjdC1tdWx0aXBsZSc7XG59XG5mdW5jdGlvbiBpc1N1Ym1pdEJ1dHRvbigkZG9tTm9kZSkge1xuICAgIHJldHVybiAkZG9tTm9kZS5ub2RlTmFtZSA9PT0gJ0JVVFRPTicgJiYgJGRvbU5vZGUudHlwZSA9PT0gJ3N1Ym1pdCc7XG59XG5mdW5jdGlvbiBpc0NoZWNrZWQoJGRvbU5vZGUpIHtcbiAgICByZXR1cm4gJGRvbU5vZGUuY2hlY2tlZDtcbn1cbi8vZnVuY3Rpb24gaXNNdWx0aXBsZSgkZG9tTm9kZSl7XG4vLyAgcmV0dXJuICgkZG9tTm9kZS5tdWx0aXBsZSA/IHRydWUgOiBmYWxzZSk7XG4vL31cbmZ1bmN0aW9uIGlzRmlsZUxpc3QoJGRvbU5vZGUpIHtcbiAgICByZXR1cm4gKHdpbmRvdy5GaWxlTGlzdCAmJiAoJGRvbU5vZGUuZmlsZXMgaW5zdGFuY2VvZiB3aW5kb3cuRmlsZUxpc3QpKTtcbn1cbmZ1bmN0aW9uIGdldE5vZGVWYWx1ZXMoJGRvbU5vZGUpIHtcbiAgICB2YXIgX2E7XG4gICAgLy8gV2UncmUgb25seSBpbnRlcmVzdGVkIGluIHRoZSByYWRpbyB0aGF0IGlzIGNoZWNrZWQuXG4gICAgaWYgKGlzUmFkaW8oJGRvbU5vZGUpKSB7XG4gICAgICAgIHJldHVybiBpc0NoZWNrZWQoJGRvbU5vZGUpID8gJGRvbU5vZGUudmFsdWUgOiBmYWxzZTtcbiAgICB9XG4gICAgLy8gV2UncmUgb25seSBpbnRlcmVzdGVkIGluIHRoZSBjaGVja2JveCB0aGF0IGlzIGNoZWNrZWQuXG4gICAgaWYgKGlzQ2hlY2tib3goJGRvbU5vZGUpKSB7XG4gICAgICAgIHJldHVybiBpc0NoZWNrZWQoJGRvbU5vZGUpID8gJGRvbU5vZGUudmFsdWUgOiBmYWxzZTtcbiAgICB9XG4gICAgLy8gRmlsZSBpbnB1dHMgYXJlIGEgc3BlY2lhbCBjYXNlLlxuICAgIC8vIFdlIGhhdmUgdG8gZ3JhYiB0aGUgLmZpbGVzIHByb3BlcnR5IG9mIHRoZSBpbnB1dCwgd2hpY2ggaXMgYSBGaWxlTGlzdC5cbiAgICBpZiAoaXNGaWxlRmllbGQoJGRvbU5vZGUpKSB7XG4gICAgICAgIC8vIElnbm9yZSBpbnB1dCBmaWxlIGZpZWxkcyBpZiB0aGUgZm9ybSBpcyBub3QgZW5jb2RlZCBwcm9wZXJseS5cbiAgICAgICAgaWYgKGlzVXBsb2FkRm9ybSgpKSB7XG4gICAgICAgICAgICAvLyBIVE1MNSBjb21wYXRpYmxlIGJyb3dzZXIuXG4gICAgICAgICAgICBpZiAoaXNGaWxlTGlzdCgkZG9tTm9kZSkgJiYgKChfYSA9ICRkb21Ob2RlID09PSBudWxsIHx8ICRkb21Ob2RlID09PSB2b2lkIDAgPyB2b2lkIDAgOiAkZG9tTm9kZS5maWxlcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmxlbmd0aCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGRvbU5vZGUuZmlsZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCRkb21Ob2RlLnZhbHVlICYmICRkb21Ob2RlLnZhbHVlICE9PSAnJyA/XG4gICAgICAgICAgICAgICAgICAgICRkb21Ob2RlLnZhbHVlIDpcbiAgICAgICAgICAgICAgICAgICAgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFdlJ3JlIG9ubHkgaW50ZXJlc3RlZCBpbiB0ZXh0YXJlYSBmaWVsZHMgdGhhdCBoYXZlIHZhbHVlcy5cbiAgICBpZiAoaXNUZXh0YXJlYSgkZG9tTm9kZSkpIHtcbiAgICAgICAgcmV0dXJuICgkZG9tTm9kZS52YWx1ZSAmJiAkZG9tTm9kZS52YWx1ZSAhPT0gJycgP1xuICAgICAgICAgICAgJGRvbU5vZGUudmFsdWUgOlxuICAgICAgICAgICAgZmFsc2UpO1xuICAgIH1cbiAgICBpZiAoaXNTZWxlY3RTaW1wbGUoJGRvbU5vZGUpKSB7XG4gICAgICAgIGlmICgkZG9tTm9kZS52YWx1ZSAmJiAkZG9tTm9kZS52YWx1ZSAhPT0gJycpIHtcbiAgICAgICAgICAgIHJldHVybiAkZG9tTm9kZS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgkZG9tTm9kZS5vcHRpb25zICYmXG4gICAgICAgICAgICAkZG9tTm9kZS5vcHRpb25zLmxlbmd0aCAmJlxuICAgICAgICAgICAgJGRvbU5vZGUub3B0aW9uc1swXS52YWx1ZSAhPT0gJycpIHtcbiAgICAgICAgICAgIHJldHVybiAkZG9tTm9kZS5vcHRpb25zWzBdLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFdlJ3JlIG9ubHkgaW50ZXJlc3RlZCBpbiBtdWx0aXBsZSBzZWxlY3RzIHRoYXQgaGF2ZSBhdCBsZWFzdCBvbmUgb3B0aW9uIHNlbGVjdGVkLlxuICAgIGlmIChpc1NlbGVjdE11bHRpcGxlKCRkb21Ob2RlKSkge1xuICAgICAgICBpZiAoJGRvbU5vZGUub3B0aW9ucyAmJiAkZG9tTm9kZS5vcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZXNfMSA9IFtdO1xuICAgICAgICAgICAgKDAsIGZ1bmN0aW9uc18xLmZvckVhY2gpKCRkb21Ob2RlLm9wdGlvbnMsIGZ1bmN0aW9uICgkb3B0aW9uKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRvcHRpb24uc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzXzEucHVzaCgkb3B0aW9uLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5pbmNsdWRlRW1wdHlWYWx1ZWRFbGVtZW50cykge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZXNfMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAodmFsdWVzXzEubGVuZ3RoID8gdmFsdWVzXzEgOiBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gV2UncmUgb25seSBpbnRlcmVzdGVkIGlmIHRoZSBidXR0b24gaXMgdHlwZT1cInN1Ym1pdFwiXG4gICAgaWYgKGlzU3VibWl0QnV0dG9uKCRkb21Ob2RlKSkge1xuICAgICAgICBpZiAoJGRvbU5vZGUudmFsdWUgJiYgJGRvbU5vZGUudmFsdWUgIT09ICcnKSB7XG4gICAgICAgICAgICByZXR1cm4gJGRvbU5vZGUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCRkb21Ob2RlLmlubmVyVGV4dCAmJiAkZG9tTm9kZS5pbm5lclRleHQgIT09ICcnKSB7XG4gICAgICAgICAgICByZXR1cm4gJGRvbU5vZGUuaW5uZXJUZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gRmFsbGJhY2sgb3Igb3RoZXIgbm9uLXNwZWNpYWwgZmllbGRzLlxuICAgIGlmICh0eXBlb2YgJGRvbU5vZGUudmFsdWUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGlmIChzZXR0aW5ncy5pbmNsdWRlRW1wdHlWYWx1ZWRFbGVtZW50cykge1xuICAgICAgICAgICAgcmV0dXJuICRkb21Ob2RlLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICgkZG9tTm9kZS52YWx1ZSAhPT0gJycgPyAkZG9tTm9kZS52YWx1ZSA6IGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHByb2Nlc3NTaW5nbGVMZXZlbE5vZGUoJGRvbU5vZGUsIGFyciwgZG9tTm9kZVZhbHVlLCByZXN1bHQpIHtcbiAgICAvLyBHZXQgdGhlIGxhc3QgcmVtYWluaW5nIGtleS5cbiAgICB2YXIga2V5ID0gYXJyWzBdO1xuICAgIC8vIFdlJ3JlIG9ubHkgaW50ZXJlc3RlZCBpbiB0aGUgcmFkaW8gdGhhdCBpcyBjaGVja2VkLlxuICAgIGlmIChpc1JhZGlvKCRkb21Ob2RlKSkge1xuICAgICAgICBpZiAoZG9tTm9kZVZhbHVlICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBkb21Ob2RlVmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gZG9tTm9kZVZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIENoZWNrYm94ZXMgYXJlIGEgc3BlY2lhbCBjYXNlLlxuICAgIC8vIFdlIGhhdmUgdG8gZ3JhYiBlYWNoIGNoZWNrZWQgdmFsdWVzXG4gICAgLy8gYW5kIHB1dCB0aGVtIGludG8gYW4gYXJyYXkuXG4gICAgaWYgKGlzQ2hlY2tib3goJGRvbU5vZGUpKSB7XG4gICAgICAgIGlmIChkb21Ob2RlVmFsdWUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBpZiAobm9kZUhhc1NpYmxpbmdzKCRkb21Ob2RlKSkge1xuICAgICAgICAgICAgICAgIGlmICghcmVzdWx0W2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFtrZXldLnB1c2goZG9tTm9kZVZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gZG9tTm9kZVZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIE11bHRpcGxlIHNlbGVjdCBpcyBhIHNwZWNpYWwgY2FzZS5cbiAgICAvLyBXZSBoYXZlIHRvIGdyYWIgZWFjaCBzZWxlY3RlZCBvcHRpb24gYW5kIHB1dCB0aGVtIGludG8gYW4gYXJyYXkuXG4gICAgaWYgKGlzU2VsZWN0TXVsdGlwbGUoJGRvbU5vZGUpKSB7XG4gICAgICAgIGlmIChkb21Ob2RlVmFsdWUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXN1bHRba2V5XSA9IGRvbU5vZGVWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBGYWxsYmFjayBvciBvdGhlciBjYXNlcyB0aGF0IGRvbid0XG4gICAgLy8gbmVlZCBzcGVjaWFsIHRyZWF0bWVudCBvZiB0aGUgdmFsdWUuXG4gICAgcmVzdWx0W2tleV0gPSBkb21Ob2RlVmFsdWU7XG4gICAgcmV0dXJuIGRvbU5vZGVWYWx1ZTtcbn1cbi8vIGludGVyZmFjZSBOb2RlUmVzdWx0IGV4dGVuZHMgUmVjb3JkPHN0cmluZywgTm9kZVJlc3VsdD4ge31cbmZ1bmN0aW9uIHByb2Nlc3NNdWx0aUxldmVsTm9kZSgkZG9tTm9kZSwgYXJyLCB2YWx1ZSwgcmVzdWx0KSB7XG4gICAgdmFyIGtleU5hbWUgPSBhcnJbMF07XG4gICAgaWYgKGFyci5sZW5ndGggPiAxKSB7XG4gICAgICAgIGlmIChrZXlOYW1lID09PSAnW10nKSB7XG4gICAgICAgICAgICAvL3Jlc3VsdC5wdXNoKHt9KTtcbiAgICAgICAgICAgIHJlc3VsdFsoMCwgZnVuY3Rpb25zXzEuZ2V0TmV4dEludGVnZXJLZXkpKHJlc3VsdCldID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgICAgIHJldHVybiBwcm9jZXNzTXVsdGlMZXZlbE5vZGUoJGRvbU5vZGUsIGFyci5zcGxpY2UoMSwgYXJyLmxlbmd0aCksIHZhbHVlLCByZXN1bHRbKDAsIGZ1bmN0aW9uc18xLmdldExhc3RJbnRlZ2VyS2V5KShyZXN1bHQpXSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0W2tleU5hbWVdICYmICgwLCBmdW5jdGlvbnNfMS5nZXRPYmpMZW5ndGgpKHJlc3VsdFtrZXlOYW1lXSkgPiAwKSB7XG4gICAgICAgICAgICAgICAgLy9yZXN1bHRba2V5TmFtZV0ucHVzaChudWxsKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvY2Vzc011bHRpTGV2ZWxOb2RlKCRkb21Ob2RlLCBhcnIuc3BsaWNlKDEsIGFyci5sZW5ndGgpLCB2YWx1ZSwgcmVzdWx0W2tleU5hbWVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtrZXlOYW1lXSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcHJvY2Vzc011bHRpTGV2ZWxOb2RlKCRkb21Ob2RlLCBhcnIuc3BsaWNlKDEsIGFyci5sZW5ndGgpLCB2YWx1ZSwgcmVzdWx0W2tleU5hbWVdKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBMYXN0IGtleSwgYXR0YWNoIHRoZSBvcmlnaW5hbCB2YWx1ZS5cbiAgICBpZiAoYXJyLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBpZiAoa2V5TmFtZSA9PT0gJ1tdJykge1xuICAgICAgICAgICAgLy9yZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICByZXN1bHRbKDAsIGZ1bmN0aW9uc18xLmdldE5leHRJbnRlZ2VyS2V5KShyZXN1bHQpXSA9IHZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHByb2Nlc3NTaW5nbGVMZXZlbE5vZGUoJGRvbU5vZGUsIGFyciwgdmFsdWUsIHJlc3VsdCk7XG4gICAgICAgICAgICAvLyAgcmVzdWx0W2tleU5hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gY29udmVydFRvT2JqKCkge1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgb2JqS2V5TmFtZXM7XG4gICAgdmFyICRkb21Ob2RlO1xuICAgIHZhciBkb21Ob2RlVmFsdWU7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGZvciAoaSA9IDA7IGkgPCAkZm9ybUVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICRkb21Ob2RlID0gJGZvcm1FbGVtZW50c1tpXTtcbiAgICAgICAgLy8gU2tpcCB0aGUgZWxlbWVudCBpZiB0aGUgJ25hbWUnIGF0dHJpYnV0ZSBpcyBlbXB0eS5cbiAgICAgICAgLy8gU2tpcCB0aGUgJ2Rpc2FibGVkJyBlbGVtZW50cy5cbiAgICAgICAgLy8gU2tpcCB0aGUgbm9uLXNlbGVjdGVkIHJhZGlvIGVsZW1lbnRzLlxuICAgICAgICBpZiAoISRkb21Ob2RlLm5hbWUgfHxcbiAgICAgICAgICAgICRkb21Ob2RlLm5hbWUgPT09ICcnIHx8XG4gICAgICAgICAgICAkZG9tTm9kZS5kaXNhYmxlZCB8fFxuICAgICAgICAgICAgKGlzUmFkaW8oJGRvbU5vZGUpICYmICFpc0NoZWNrZWQoJGRvbU5vZGUpKSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gR2V0IHRoZSBmaW5hbCBwcm9jZXNzZWQgZG9tTm9kZSB2YWx1ZS5cbiAgICAgICAgZG9tTm9kZVZhbHVlID0gZ2V0Tm9kZVZhbHVlcygkZG9tTm9kZSk7XG4gICAgICAgIC8vIEV4Y2x1ZGUgZW1wdHkgdmFsdWVkIG5vZGVzIGlmIHRoZSBzZXR0aW5ncyBhbGxvdyBpdC5cbiAgICAgICAgaWYgKGRvbU5vZGVWYWx1ZSA9PT0gZmFsc2UgJiYgIXNldHRpbmdzLmluY2x1ZGVFbXB0eVZhbHVlZEVsZW1lbnRzKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBFeHRyYWN0IGFsbCBwb3NzaWJsZSBrZXlzXG4gICAgICAgIC8vIEUuZy4gbmFtZT1cImZpcnN0TmFtZVwiLCBuYW1lPVwic2V0dGluZ3NbYV1bYl1cIiwgbmFtZT1cInNldHRpbmdzWzBdW2FdXCJcbiAgICAgICAgb2JqS2V5TmFtZXMgPSAkZG9tTm9kZS5uYW1lLm1hdGNoKGtleVJlZ2V4KTtcbiAgICAgICAgaWYgKG9iaktleU5hbWVzICYmIG9iaktleU5hbWVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgcHJvY2Vzc1NpbmdsZUxldmVsTm9kZSgkZG9tTm9kZSwgb2JqS2V5TmFtZXMsIChkb21Ob2RlVmFsdWUgPyBkb21Ob2RlVmFsdWUgOiAnJyksIHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9iaktleU5hbWVzICYmIG9iaktleU5hbWVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHByb2Nlc3NNdWx0aUxldmVsTm9kZSgkZG9tTm9kZSwgb2JqS2V5TmFtZXMsIChkb21Ob2RlVmFsdWUgPyBkb21Ob2RlVmFsdWUgOiAnJyksIHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQ2hlY2sgdGhlIGxlbmd0aCBvZiB0aGUgcmVzdWx0LlxuICAgIHZhciByZXN1bHRMZW5ndGggPSAoMCwgZnVuY3Rpb25zXzEuZ2V0T2JqTGVuZ3RoKShyZXN1bHQpO1xuICAgIHJldHVybiByZXN1bHRMZW5ndGggPiAwID8gcmVzdWx0IDogZmFsc2U7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBjb3JlXzEgPSByZXF1aXJlKFwiLi9jb3JlXCIpO1xuKGZ1bmN0aW9uICh3aW5kb3cpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIGZvcm1Ub09iamVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIGFyZ3NbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29yZV8xLmluaXQuYXBwbHkodm9pZCAwLCBhcmdzKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEV4cG9zZSB0aGUgZmluYWwgY2xhc3MuXG4gICAgICogQHR5cGUgRnVuY3Rpb25cbiAgICAgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiAoZGVmaW5lID09PSBudWxsIHx8IGRlZmluZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZGVmaW5lLmFtZCkpIHtcbiAgICAgICAgLy8gQU1EL3JlcXVpcmVqczogRGVmaW5lIHRoZSBtb2R1bGVcbiAgICAgICAgZGVmaW5lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBmb3JtVG9PYmplY3Q7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiAobW9kdWxlID09PSBudWxsIHx8IG1vZHVsZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogbW9kdWxlLmV4cG9ydHMpKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZm9ybVRvT2JqZWN0O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gQnJvd3NlcjogRXhwb3NlIHRvIHdpbmRvd1xuICAgICAgICB3aW5kb3dbJ2Zvcm1Ub09iamVjdCddID0gZm9ybVRvT2JqZWN0O1xuICAgIH1cbn0pKHdpbmRvdyk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogUHJpdmF0ZSBtZXRob2RzXG4gKi9cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZm9yRWFjaCA9IGV4cG9ydHMuZXh0ZW5kID0gZXhwb3J0cy5nZXRPYmpMZW5ndGggPSBleHBvcnRzLmdldE5leHRJbnRlZ2VyS2V5ID0gZXhwb3J0cy5nZXRMYXN0SW50ZWdlcktleSA9IGV4cG9ydHMuY2hlY2tGb3JMYXN0TnVtZXJpY0tleSA9IGV4cG9ydHMuaXNEb21FbGVtZW50Tm9kZSA9IHZvaWQgMDtcbi8qKlxuICogQ2hlY2sgdG8gc2VlIGlmIHRoZSBvYmplY3QgaXMgYW4gSFRNTCBub2RlLlxuICpcbiAqIEBwYXJhbSB7SFRNTEZvcm1FbGVtZW50IHwgSFRNTEVsZW1lbnR9IG5vZGVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc0RvbUVsZW1lbnROb2RlKG5vZGUpIHtcbiAgICByZXR1cm4gKG5vZGUgJiYgdHlwZW9mIG5vZGUgPT09ICdvYmplY3QnICYmICdub2RlVHlwZScgaW4gbm9kZSAmJiBub2RlLm5vZGVUeXBlID09PSAxKTtcbn1cbmV4cG9ydHMuaXNEb21FbGVtZW50Tm9kZSA9IGlzRG9tRWxlbWVudE5vZGU7XG4vKipcbiAqIENoZWNrIGZvciBsYXN0IG51bWVyaWMga2V5LlxuICovXG5mdW5jdGlvbiBjaGVja0Zvckxhc3ROdW1lcmljS2V5KG8pIHtcbiAgICBpZiAoIW8gfHwgdHlwZW9mIG8gIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG8pLmZpbHRlcihmdW5jdGlvbiAoZWxlbSkge1xuICAgICAgICByZXR1cm4gIWlzTmFOKHBhcnNlSW50KGVsZW0sIDEwKSk7XG4gICAgfSkuc3BsaWNlKC0xKVswXTtcbn1cbmV4cG9ydHMuY2hlY2tGb3JMYXN0TnVtZXJpY0tleSA9IGNoZWNrRm9yTGFzdE51bWVyaWNLZXk7XG4vKipcbiAqIEdldCBsYXN0IG51bWVyaWMga2V5IGZyb20gYW4gb2JqZWN0LlxuICogQHBhcmFtIG8gb2JqZWN0XG4gKiBAcmV0dXJuIGludFxuICovXG5mdW5jdGlvbiBnZXRMYXN0SW50ZWdlcktleShvKSB7XG4gICAgdmFyIGxhc3RLZXlJbmRleCA9IGNoZWNrRm9yTGFzdE51bWVyaWNLZXkobyk7XG4gICAgaWYgKHR5cGVvZiBsYXN0S2V5SW5kZXggPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUludChsYXN0S2V5SW5kZXgsIDEwKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn1cbmV4cG9ydHMuZ2V0TGFzdEludGVnZXJLZXkgPSBnZXRMYXN0SW50ZWdlcktleTtcbi8qKlxuICogR2V0IHRoZSBuZXh0IG51bWVyaWMga2V5IChsaWtlIHRoZSBpbmRleCBmcm9tIGEgUEhQIGFycmF5KVxuICogQHBhcmFtIG8gb2JqZWN0XG4gKiBAcmV0dXJuIGludFxuICovXG5mdW5jdGlvbiBnZXROZXh0SW50ZWdlcktleShvKSB7XG4gICAgdmFyIGxhc3RLZXlJbmRleCA9IGNoZWNrRm9yTGFzdE51bWVyaWNLZXkobyk7XG4gICAgaWYgKHR5cGVvZiBsYXN0S2V5SW5kZXggPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUludChsYXN0S2V5SW5kZXgsIDEwKSArIDE7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG59XG5leHBvcnRzLmdldE5leHRJbnRlZ2VyS2V5ID0gZ2V0TmV4dEludGVnZXJLZXk7XG4vKipcbiAqIEdldCB0aGUgcmVhbCBudW1iZXIgb2YgcHJvcGVydGllcyBmcm9tIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb1xuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gZ2V0T2JqTGVuZ3RoKG8pIHtcbiAgICBpZiAodHlwZW9mIG8gIT09ICdvYmplY3QnIHx8IG8gPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIHZhciBsID0gMDtcbiAgICB2YXIgaztcbiAgICBpZiAodHlwZW9mIE9iamVjdC5rZXlzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGwgPSBPYmplY3Qua2V5cyhvKS5sZW5ndGg7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmb3IgKGsgaW4gbykge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBrKSkge1xuICAgICAgICAgICAgICAgIGwrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbDtcbn1cbmV4cG9ydHMuZ2V0T2JqTGVuZ3RoID0gZ2V0T2JqTGVuZ3RoO1xuLyoqXG4gKiBTaW1wbGUgZXh0ZW5kIG9mIG93biBwcm9wZXJ0aWVzLlxuICogTmVlZGVkIGZvciBvdXIgc2V0dGluZ3MuXG4gKlxuICogQHBhcmFtIHtJU2V0dGluZ3N9IHNldHRpbmdzXG4gKiBAcGFyYW0gIHtJU2V0dGluZ3N9IHNvdXJjZSBUaGUgb2JqZWN0IHdpdGggbmV3IHByb3BlcnRpZXMgdGhhdCB3ZSB3YW50IHRvIGFkZCB0aGUgZGVzdGluYXRpb24uXG4gKiBAcmV0dXJuIHtJU2V0dGluZ3N9XG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChzZXR0aW5ncywgc291cmNlKSB7XG4gICAgdmFyIGk7XG4gICAgZm9yIChpIGluIHNvdXJjZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwgaSkpIHtcbiAgICAgICAgICAgIHNldHRpbmdzW2ldID0gc291cmNlW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzZXR0aW5ncztcbn1cbmV4cG9ydHMuZXh0ZW5kID0gZXh0ZW5kO1xuLy8gSXRlcmF0aW9uIHRocm91Z2ggY29sbGVjdGlvbnMuIENvbXBhdGlibGUgd2l0aCBJRS5cbmZ1bmN0aW9uIGZvckVhY2goYXJyLCBjYWxsYmFjaykge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGFyciwgY2FsbGJhY2spO1xufVxuZXhwb3J0cy5mb3JFYWNoID0gZm9yRWFjaDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdGxvYWRlZDogZmFsc2UsXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuXHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIl9fd2VicGFja19yZXF1aXJlX18uYW1kRCA9IGZ1bmN0aW9uICgpIHtcblx0dGhyb3cgbmV3IEVycm9yKCdkZWZpbmUgY2Fubm90IGJlIHVzZWQgaW5kaXJlY3QnKTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5hbWRPID0ge307IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5ubWQgPSAobW9kdWxlKSA9PiB7XG5cdG1vZHVsZS5wYXRocyA9IFtdO1xuXHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdHJldHVybiBtb2R1bGU7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2V4cG9zZS10by1icm93c2VyLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9