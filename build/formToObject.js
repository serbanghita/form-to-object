(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["formToObject"] = factory();
	else
		root["formToObject"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/FormToObject.ts":
/*!*****************************!*\
  !*** ./src/FormToObject.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FormToObject = void 0;
const dom_1 = __webpack_require__(/*! ./dom */ "./src/dom.ts");
const utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
class FormToObject {
    constructor(selector, options) {
        this.formSelector = '';
        this.$form = null;
        this.$formElements = [];
        // Experimental. Don't rely on them yet.
        this.settings = {
            includeEmptyValuedElements: false,
            w3cSuccessfulControlsOnly: false,
            debug: true
        };
        // Assign the current form reference.
        if (!selector) {
            throw new Error('No selector was passed.');
        }
        // The form reference is always the first parameter of the method.
        // Eg: formToObject('myForm')
        this.formSelector = selector;
        // Override current settings.
        // Eg. formToObject('myForm', {mySetting: true})
        if (typeof options !== 'undefined' && (0, utils_1.getObjLength)(options) > 0) {
            (0, utils_1.extend)(this.settings, options);
        }
        if (!this.initForm()) {
            throw new Error('The <form> DOM element could not be found.');
        }
        if (!this.initFormElements()) {
            throw new Error('No <form> DOM elements were found. Form is empty.');
        }
    }
    /**
     * An HTML <form> can be initialized with a string DOM selector e.g. '.myForm'
     * or a DOM object reference.
     */
    initForm() {
        if (typeof this.formSelector === 'string') {
            this.$form = document.getElementById(this.formSelector);
            return (0, dom_1.isDomElementNode)(this.$form);
        }
        else if ((0, dom_1.isDomElementNode)(this.formSelector)) { // @todo: Should I check for DOM.nodeType?
            this.$form = this.formSelector;
            return true;
        }
        return false;
    }
    // Set the elements we need to parse.
    initFormElements() {
        var _a;
        this.$formElements = [...(_a = this.$form) === null || _a === void 0 ? void 0 : _a.querySelectorAll('input, textarea, select')];
        return this.$formElements.length > 0;
    }
    convertToObj() {
        let i = 0;
        let objKeyNames;
        let $domNode;
        let domNodeValue;
        const result = Object.create(null);
        for (i = 0; i < this.$formElements.length; i++) {
            $domNode = this.$formElements[i];
            // Skip the element if the 'name' attribute is empty.
            // Skip the 'disabled' elements.
            // Skip the non-selected radio elements.
            if (!$domNode.name ||
                $domNode.name === '' ||
                $domNode.disabled ||
                ((0, dom_1.isRadio)($domNode) && !(0, dom_1.isChecked)($domNode))) {
                continue;
            }
            // Get the final processed domNode value.
            domNodeValue = this.getNodeValues($domNode);
            // Exclude empty valued nodes if the settings allow it.
            if (domNodeValue === false && !this.settings.includeEmptyValuedElements) {
                continue;
            }
            // Extract all possible keys
            // E.g. name="firstName", name="settings[a][b]", name="settings[0][a]"
            objKeyNames = $domNode.name.match(FormToObject.keyRegex);
            if (objKeyNames && objKeyNames.length === 1) {
                this.processSingleLevelNode($domNode, objKeyNames, (domNodeValue ? domNodeValue : ''), result);
            }
            if (objKeyNames && objKeyNames.length > 1) {
                this.processMultiLevelNode($domNode, objKeyNames, (domNodeValue ? domNodeValue : ''), result);
            }
        }
        // Check the length of the result.
        const resultLength = (0, utils_1.getObjLength)(result);
        return resultLength > 0 ? result : false;
    }
    getNodeValues($domNode) {
        var _a;
        // We're only interested in the radio that is checked.
        if ((0, dom_1.isRadio)($domNode)) {
            return (0, dom_1.isChecked)($domNode) ? $domNode.value : false;
        }
        // We're only interested in the checkbox that is checked.
        if ((0, dom_1.isCheckbox)($domNode)) {
            return (0, dom_1.isChecked)($domNode) ? $domNode.value : false;
        }
        // File inputs are a special case.
        // We have to grab the .files property of the input, which is a FileList.
        if ((0, dom_1.isFileField)($domNode)) {
            // Ignore input file fields if the form is not encoded properly.
            if ((0, dom_1.isUploadForm)(this.$form)) {
                // HTML5 compatible browser.
                if ((0, dom_1.isFileList)($domNode) && ((_a = $domNode === null || $domNode === void 0 ? void 0 : $domNode.files) === null || _a === void 0 ? void 0 : _a.length)) {
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
        if ((0, dom_1.isTextarea)($domNode)) {
            return ($domNode.value && $domNode.value !== '' ?
                $domNode.value :
                false);
        }
        if ((0, dom_1.isSelectSimple)($domNode)) {
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
        if ((0, dom_1.isSelectMultiple)($domNode)) {
            if ($domNode.options && $domNode.options.length > 0) {
                const values = [];
                (0, utils_1.forEach)($domNode.options, function ($option) {
                    if ($option.selected) {
                        values.push($option.value);
                    }
                });
                if (this.settings.includeEmptyValuedElements) {
                    return values;
                }
                else {
                    return (values.length ? values : false);
                }
            }
            else {
                return false;
            }
        }
        // We're only interested if the button is type="submit"
        if ((0, dom_1.isSubmitButton)($domNode)) {
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
            if (this.settings.includeEmptyValuedElements) {
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
    processSingleLevelNode($domNode, arr, domNodeValue, result) {
        // Get the last remaining key.
        const key = arr[0];
        // We're only interested in the radio that is checked.
        if ((0, dom_1.isRadio)($domNode)) {
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
        if ((0, dom_1.isCheckbox)($domNode)) {
            if (domNodeValue !== false) {
                if (this.formElementHasSiblings($domNode)) {
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
        if ((0, dom_1.isSelectMultiple)($domNode)) {
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
    processMultiLevelNode($domNode, arr, value, result) {
        const keyName = arr[0];
        if (arr.length > 1) {
            if (keyName === '[]') {
                //result.push({});
                result[(0, utils_1.getNextIntegerKey)(result)] = Object.create(null);
                return this.processMultiLevelNode($domNode, arr.splice(1, arr.length), value, result[(0, utils_1.getLastIntegerKey)(result)]);
            }
            else {
                if (result[keyName] && (0, utils_1.getObjLength)(result[keyName]) > 0) {
                    //result[keyName].push(null);
                    return this.processMultiLevelNode($domNode, arr.splice(1, arr.length), value, result[keyName]);
                }
                else {
                    result[keyName] = Object.create(null);
                }
                return this.processMultiLevelNode($domNode, arr.splice(1, arr.length), value, result[keyName]);
            }
        }
        // Last key, attach the original value.
        if (arr.length === 1) {
            if (keyName === '[]') {
                //result.push(value);
                result[(0, utils_1.getNextIntegerKey)(result)] = value;
                return result;
            }
            else {
                this.processSingleLevelNode($domNode, arr, value, result);
                //  result[keyName] = value;
                return result;
            }
        }
    }
    formElementHasSiblings($domNode) {
        const name = $domNode.name;
        return Array.prototype.filter.call(this.$formElements, (input) => { return input.name === name; }).length > 1;
    }
}
exports.FormToObject = FormToObject;
// Currently matching only fields like 'fieldName[...] or fieldName[]'.
FormToObject.keyRegex = /[^[\]]+|\[]/g;


/***/ }),

/***/ "./src/dom.ts":
/*!********************!*\
  !*** ./src/dom.ts ***!
  \********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isFileList = exports.isChecked = exports.isSubmitButton = exports.isSelectMultiple = exports.isSelectSimple = exports.isTextarea = exports.isFileField = exports.isCheckbox = exports.isRadio = exports.isUploadForm = exports.isDomElementNode = void 0;
/**
 * Check to see if the object is an HTML node.
 *
 * @param {HTMLFormElement | HTMLElement} node
 * @returns {boolean}
 */
function isDomElementNode(node) {
    return (Boolean(node) && typeof node === 'object' && 'nodeType' in node && node.nodeType === 1);
}
exports.isDomElementNode = isDomElementNode;
function isUploadForm($form) {
    return Boolean($form.enctype && $form.enctype === 'multipart/form-data');
}
exports.isUploadForm = isUploadForm;
function isRadio($domNode) {
    return $domNode.nodeName === 'INPUT' && $domNode.type === 'radio';
}
exports.isRadio = isRadio;
function isCheckbox($domNode) {
    return $domNode.nodeName === 'INPUT' && $domNode.type === 'checkbox';
}
exports.isCheckbox = isCheckbox;
function isFileField($domNode) {
    return $domNode.nodeName === 'INPUT' && $domNode.type === 'file';
}
exports.isFileField = isFileField;
function isTextarea($domNode) {
    return $domNode.nodeName === 'TEXTAREA';
}
exports.isTextarea = isTextarea;
function isSelectSimple($domNode) {
    return $domNode.nodeName === 'SELECT' && $domNode.type === 'select-one';
}
exports.isSelectSimple = isSelectSimple;
function isSelectMultiple($domNode) {
    return $domNode.nodeName === 'SELECT' && $domNode.type === 'select-multiple';
}
exports.isSelectMultiple = isSelectMultiple;
function isSubmitButton($domNode) {
    return $domNode.nodeName === 'BUTTON' && $domNode.type === 'submit';
}
exports.isSubmitButton = isSubmitButton;
function isChecked($domNode) {
    return $domNode.checked;
}
exports.isChecked = isChecked;
//function isMultiple($domNode){
//  return ($domNode.multiple ? true : false);
//}
function isFileList($domNode) {
    return (window.FileList && ($domNode.files instanceof window.FileList));
}
exports.isFileList = isFileList;


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.forEach = exports.extend = exports.getObjLength = exports.getNextIntegerKey = exports.getLastIntegerKey = exports.checkForLastNumericKey = void 0;
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
    const lastKeyIndex = checkForLastNumericKey(o);
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
    const lastKeyIndex = checkForLastNumericKey(o);
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
    let l = 0;
    let k;
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
 * @param {IFormToObjectOptions} settings
 * @param  {IFormToObjectOptions} source The object with new properties that we want to add the destination.
 * @return {IFormToObjectOptions}
 */
function extend(settings, source) {
    let i;
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
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const FormToObject_1 = __webpack_require__(/*! ./FormToObject */ "./src/FormToObject.ts");
function formToObject(selector, options) {
    try {
        const instance = new FormToObject_1.FormToObject(selector, options);
        return instance.convertToObj();
    }
    catch (e) {
        console.log('formToObject ERROR:', e.message);
        return false;
    }
}
exports["default"] = formToObject;

})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQSxXQUFXLHNCQUFzQjtBQUNqQyxZQUFZLHNCQUFzQjtBQUNsQyxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlOzs7Ozs7O1VDNUZmO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7QUN0QmE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsdUJBQXVCLG1CQUFPLENBQUMsNkNBQWdCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mb3JtVG9PYmplY3Qvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2Zvcm1Ub09iamVjdC8uL3NyYy9Gb3JtVG9PYmplY3QudHMiLCJ3ZWJwYWNrOi8vZm9ybVRvT2JqZWN0Ly4vc3JjL2RvbS50cyIsIndlYnBhY2s6Ly9mb3JtVG9PYmplY3QvLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vZm9ybVRvT2JqZWN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Zvcm1Ub09iamVjdC8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJmb3JtVG9PYmplY3RcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiZm9ybVRvT2JqZWN0XCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgKCkgPT4ge1xucmV0dXJuICIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Gb3JtVG9PYmplY3QgPSB2b2lkIDA7XG5jb25zdCBkb21fMSA9IHJlcXVpcmUoXCIuL2RvbVwiKTtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbmNsYXNzIEZvcm1Ub09iamVjdCB7XG4gICAgY29uc3RydWN0b3Ioc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5mb3JtU2VsZWN0b3IgPSAnJztcbiAgICAgICAgdGhpcy4kZm9ybSA9IG51bGw7XG4gICAgICAgIHRoaXMuJGZvcm1FbGVtZW50cyA9IFtdO1xuICAgICAgICAvLyBFeHBlcmltZW50YWwuIERvbid0IHJlbHkgb24gdGhlbSB5ZXQuXG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSB7XG4gICAgICAgICAgICBpbmNsdWRlRW1wdHlWYWx1ZWRFbGVtZW50czogZmFsc2UsXG4gICAgICAgICAgICB3M2NTdWNjZXNzZnVsQ29udHJvbHNPbmx5OiBmYWxzZSxcbiAgICAgICAgICAgIGRlYnVnOiB0cnVlXG4gICAgICAgIH07XG4gICAgICAgIC8vIEFzc2lnbiB0aGUgY3VycmVudCBmb3JtIHJlZmVyZW5jZS5cbiAgICAgICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBzZWxlY3RvciB3YXMgcGFzc2VkLicpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRoZSBmb3JtIHJlZmVyZW5jZSBpcyBhbHdheXMgdGhlIGZpcnN0IHBhcmFtZXRlciBvZiB0aGUgbWV0aG9kLlxuICAgICAgICAvLyBFZzogZm9ybVRvT2JqZWN0KCdteUZvcm0nKVxuICAgICAgICB0aGlzLmZvcm1TZWxlY3RvciA9IHNlbGVjdG9yO1xuICAgICAgICAvLyBPdmVycmlkZSBjdXJyZW50IHNldHRpbmdzLlxuICAgICAgICAvLyBFZy4gZm9ybVRvT2JqZWN0KCdteUZvcm0nLCB7bXlTZXR0aW5nOiB0cnVlfSlcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAndW5kZWZpbmVkJyAmJiAoMCwgdXRpbHNfMS5nZXRPYmpMZW5ndGgpKG9wdGlvbnMpID4gMCkge1xuICAgICAgICAgICAgKDAsIHV0aWxzXzEuZXh0ZW5kKSh0aGlzLnNldHRpbmdzLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuaW5pdEZvcm0oKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgPGZvcm0+IERPTSBlbGVtZW50IGNvdWxkIG5vdCBiZSBmb3VuZC4nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuaW5pdEZvcm1FbGVtZW50cygpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIDxmb3JtPiBET00gZWxlbWVudHMgd2VyZSBmb3VuZC4gRm9ybSBpcyBlbXB0eS4nKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBBbiBIVE1MIDxmb3JtPiBjYW4gYmUgaW5pdGlhbGl6ZWQgd2l0aCBhIHN0cmluZyBET00gc2VsZWN0b3IgZS5nLiAnLm15Rm9ybSdcbiAgICAgKiBvciBhIERPTSBvYmplY3QgcmVmZXJlbmNlLlxuICAgICAqL1xuICAgIGluaXRGb3JtKCkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuZm9ybVNlbGVjdG9yID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy4kZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZm9ybVNlbGVjdG9yKTtcbiAgICAgICAgICAgIHJldHVybiAoMCwgZG9tXzEuaXNEb21FbGVtZW50Tm9kZSkodGhpcy4kZm9ybSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoKDAsIGRvbV8xLmlzRG9tRWxlbWVudE5vZGUpKHRoaXMuZm9ybVNlbGVjdG9yKSkgeyAvLyBAdG9kbzogU2hvdWxkIEkgY2hlY2sgZm9yIERPTS5ub2RlVHlwZT9cbiAgICAgICAgICAgIHRoaXMuJGZvcm0gPSB0aGlzLmZvcm1TZWxlY3RvcjtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gU2V0IHRoZSBlbGVtZW50cyB3ZSBuZWVkIHRvIHBhcnNlLlxuICAgIGluaXRGb3JtRWxlbWVudHMoKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgdGhpcy4kZm9ybUVsZW1lbnRzID0gWy4uLihfYSA9IHRoaXMuJGZvcm0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCwgdGV4dGFyZWEsIHNlbGVjdCcpXTtcbiAgICAgICAgcmV0dXJuIHRoaXMuJGZvcm1FbGVtZW50cy5sZW5ndGggPiAwO1xuICAgIH1cbiAgICBjb252ZXJ0VG9PYmooKSB7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgbGV0IG9iaktleU5hbWVzO1xuICAgICAgICBsZXQgJGRvbU5vZGU7XG4gICAgICAgIGxldCBkb21Ob2RlVmFsdWU7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLiRmb3JtRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICRkb21Ob2RlID0gdGhpcy4kZm9ybUVsZW1lbnRzW2ldO1xuICAgICAgICAgICAgLy8gU2tpcCB0aGUgZWxlbWVudCBpZiB0aGUgJ25hbWUnIGF0dHJpYnV0ZSBpcyBlbXB0eS5cbiAgICAgICAgICAgIC8vIFNraXAgdGhlICdkaXNhYmxlZCcgZWxlbWVudHMuXG4gICAgICAgICAgICAvLyBTa2lwIHRoZSBub24tc2VsZWN0ZWQgcmFkaW8gZWxlbWVudHMuXG4gICAgICAgICAgICBpZiAoISRkb21Ob2RlLm5hbWUgfHxcbiAgICAgICAgICAgICAgICAkZG9tTm9kZS5uYW1lID09PSAnJyB8fFxuICAgICAgICAgICAgICAgICRkb21Ob2RlLmRpc2FibGVkIHx8XG4gICAgICAgICAgICAgICAgKCgwLCBkb21fMS5pc1JhZGlvKSgkZG9tTm9kZSkgJiYgISgwLCBkb21fMS5pc0NoZWNrZWQpKCRkb21Ob2RlKSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEdldCB0aGUgZmluYWwgcHJvY2Vzc2VkIGRvbU5vZGUgdmFsdWUuXG4gICAgICAgICAgICBkb21Ob2RlVmFsdWUgPSB0aGlzLmdldE5vZGVWYWx1ZXMoJGRvbU5vZGUpO1xuICAgICAgICAgICAgLy8gRXhjbHVkZSBlbXB0eSB2YWx1ZWQgbm9kZXMgaWYgdGhlIHNldHRpbmdzIGFsbG93IGl0LlxuICAgICAgICAgICAgaWYgKGRvbU5vZGVWYWx1ZSA9PT0gZmFsc2UgJiYgIXRoaXMuc2V0dGluZ3MuaW5jbHVkZUVtcHR5VmFsdWVkRWxlbWVudHMpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEV4dHJhY3QgYWxsIHBvc3NpYmxlIGtleXNcbiAgICAgICAgICAgIC8vIEUuZy4gbmFtZT1cImZpcnN0TmFtZVwiLCBuYW1lPVwic2V0dGluZ3NbYV1bYl1cIiwgbmFtZT1cInNldHRpbmdzWzBdW2FdXCJcbiAgICAgICAgICAgIG9iaktleU5hbWVzID0gJGRvbU5vZGUubmFtZS5tYXRjaChGb3JtVG9PYmplY3Qua2V5UmVnZXgpO1xuICAgICAgICAgICAgaWYgKG9iaktleU5hbWVzICYmIG9iaktleU5hbWVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc1NpbmdsZUxldmVsTm9kZSgkZG9tTm9kZSwgb2JqS2V5TmFtZXMsIChkb21Ob2RlVmFsdWUgPyBkb21Ob2RlVmFsdWUgOiAnJyksIHJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob2JqS2V5TmFtZXMgJiYgb2JqS2V5TmFtZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc011bHRpTGV2ZWxOb2RlKCRkb21Ob2RlLCBvYmpLZXlOYW1lcywgKGRvbU5vZGVWYWx1ZSA/IGRvbU5vZGVWYWx1ZSA6ICcnKSwgcmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBDaGVjayB0aGUgbGVuZ3RoIG9mIHRoZSByZXN1bHQuXG4gICAgICAgIGNvbnN0IHJlc3VsdExlbmd0aCA9ICgwLCB1dGlsc18xLmdldE9iakxlbmd0aCkocmVzdWx0KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdExlbmd0aCA+IDAgPyByZXN1bHQgOiBmYWxzZTtcbiAgICB9XG4gICAgZ2V0Tm9kZVZhbHVlcygkZG9tTm9kZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIC8vIFdlJ3JlIG9ubHkgaW50ZXJlc3RlZCBpbiB0aGUgcmFkaW8gdGhhdCBpcyBjaGVja2VkLlxuICAgICAgICBpZiAoKDAsIGRvbV8xLmlzUmFkaW8pKCRkb21Ob2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuICgwLCBkb21fMS5pc0NoZWNrZWQpKCRkb21Ob2RlKSA/ICRkb21Ob2RlLnZhbHVlIDogZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2UncmUgb25seSBpbnRlcmVzdGVkIGluIHRoZSBjaGVja2JveCB0aGF0IGlzIGNoZWNrZWQuXG4gICAgICAgIGlmICgoMCwgZG9tXzEuaXNDaGVja2JveCkoJGRvbU5vZGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gKDAsIGRvbV8xLmlzQ2hlY2tlZCkoJGRvbU5vZGUpID8gJGRvbU5vZGUudmFsdWUgOiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBGaWxlIGlucHV0cyBhcmUgYSBzcGVjaWFsIGNhc2UuXG4gICAgICAgIC8vIFdlIGhhdmUgdG8gZ3JhYiB0aGUgLmZpbGVzIHByb3BlcnR5IG9mIHRoZSBpbnB1dCwgd2hpY2ggaXMgYSBGaWxlTGlzdC5cbiAgICAgICAgaWYgKCgwLCBkb21fMS5pc0ZpbGVGaWVsZCkoJGRvbU5vZGUpKSB7XG4gICAgICAgICAgICAvLyBJZ25vcmUgaW5wdXQgZmlsZSBmaWVsZHMgaWYgdGhlIGZvcm0gaXMgbm90IGVuY29kZWQgcHJvcGVybHkuXG4gICAgICAgICAgICBpZiAoKDAsIGRvbV8xLmlzVXBsb2FkRm9ybSkodGhpcy4kZm9ybSkpIHtcbiAgICAgICAgICAgICAgICAvLyBIVE1MNSBjb21wYXRpYmxlIGJyb3dzZXIuXG4gICAgICAgICAgICAgICAgaWYgKCgwLCBkb21fMS5pc0ZpbGVMaXN0KSgkZG9tTm9kZSkgJiYgKChfYSA9ICRkb21Ob2RlID09PSBudWxsIHx8ICRkb21Ob2RlID09PSB2b2lkIDAgPyB2b2lkIDAgOiAkZG9tTm9kZS5maWxlcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmxlbmd0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRkb21Ob2RlLmZpbGVzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgkZG9tTm9kZS52YWx1ZSAmJiAkZG9tTm9kZS52YWx1ZSAhPT0gJycgP1xuICAgICAgICAgICAgICAgICAgICAgICAgJGRvbU5vZGUudmFsdWUgOlxuICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBXZSdyZSBvbmx5IGludGVyZXN0ZWQgaW4gdGV4dGFyZWEgZmllbGRzIHRoYXQgaGF2ZSB2YWx1ZXMuXG4gICAgICAgIGlmICgoMCwgZG9tXzEuaXNUZXh0YXJlYSkoJGRvbU5vZGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gKCRkb21Ob2RlLnZhbHVlICYmICRkb21Ob2RlLnZhbHVlICE9PSAnJyA/XG4gICAgICAgICAgICAgICAgJGRvbU5vZGUudmFsdWUgOlxuICAgICAgICAgICAgICAgIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKDAsIGRvbV8xLmlzU2VsZWN0U2ltcGxlKSgkZG9tTm9kZSkpIHtcbiAgICAgICAgICAgIGlmICgkZG9tTm9kZS52YWx1ZSAmJiAkZG9tTm9kZS52YWx1ZSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGRvbU5vZGUudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICgkZG9tTm9kZS5vcHRpb25zICYmXG4gICAgICAgICAgICAgICAgJGRvbU5vZGUub3B0aW9ucy5sZW5ndGggJiZcbiAgICAgICAgICAgICAgICAkZG9tTm9kZS5vcHRpb25zWzBdLnZhbHVlICE9PSAnJykge1xuICAgICAgICAgICAgICAgIHJldHVybiAkZG9tTm9kZS5vcHRpb25zWzBdLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFdlJ3JlIG9ubHkgaW50ZXJlc3RlZCBpbiBtdWx0aXBsZSBzZWxlY3RzIHRoYXQgaGF2ZSBhdCBsZWFzdCBvbmUgb3B0aW9uIHNlbGVjdGVkLlxuICAgICAgICBpZiAoKDAsIGRvbV8xLmlzU2VsZWN0TXVsdGlwbGUpKCRkb21Ob2RlKSkge1xuICAgICAgICAgICAgaWYgKCRkb21Ob2RlLm9wdGlvbnMgJiYgJGRvbU5vZGUub3B0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWVzID0gW107XG4gICAgICAgICAgICAgICAgKDAsIHV0aWxzXzEuZm9yRWFjaCkoJGRvbU5vZGUub3B0aW9ucywgZnVuY3Rpb24gKCRvcHRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRvcHRpb24uc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKCRvcHRpb24udmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuaW5jbHVkZUVtcHR5VmFsdWVkRWxlbWVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAodmFsdWVzLmxlbmd0aCA/IHZhbHVlcyA6IGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2UncmUgb25seSBpbnRlcmVzdGVkIGlmIHRoZSBidXR0b24gaXMgdHlwZT1cInN1Ym1pdFwiXG4gICAgICAgIGlmICgoMCwgZG9tXzEuaXNTdWJtaXRCdXR0b24pKCRkb21Ob2RlKSkge1xuICAgICAgICAgICAgaWYgKCRkb21Ob2RlLnZhbHVlICYmICRkb21Ob2RlLnZhbHVlICE9PSAnJykge1xuICAgICAgICAgICAgICAgIHJldHVybiAkZG9tTm9kZS52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkZG9tTm9kZS5pbm5lclRleHQgJiYgJGRvbU5vZGUuaW5uZXJUZXh0ICE9PSAnJykge1xuICAgICAgICAgICAgICAgIHJldHVybiAkZG9tTm9kZS5pbm5lclRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRmFsbGJhY2sgb3Igb3RoZXIgbm9uLXNwZWNpYWwgZmllbGRzLlxuICAgICAgICBpZiAodHlwZW9mICRkb21Ob2RlLnZhbHVlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuaW5jbHVkZUVtcHR5VmFsdWVkRWxlbWVudHMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGRvbU5vZGUudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCRkb21Ob2RlLnZhbHVlICE9PSAnJyA/ICRkb21Ob2RlLnZhbHVlIDogZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByb2Nlc3NTaW5nbGVMZXZlbE5vZGUoJGRvbU5vZGUsIGFyciwgZG9tTm9kZVZhbHVlLCByZXN1bHQpIHtcbiAgICAgICAgLy8gR2V0IHRoZSBsYXN0IHJlbWFpbmluZyBrZXkuXG4gICAgICAgIGNvbnN0IGtleSA9IGFyclswXTtcbiAgICAgICAgLy8gV2UncmUgb25seSBpbnRlcmVzdGVkIGluIHRoZSByYWRpbyB0aGF0IGlzIGNoZWNrZWQuXG4gICAgICAgIGlmICgoMCwgZG9tXzEuaXNSYWRpbykoJGRvbU5vZGUpKSB7XG4gICAgICAgICAgICBpZiAoZG9tTm9kZVZhbHVlICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gZG9tTm9kZVZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBkb21Ob2RlVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2hlY2tib3hlcyBhcmUgYSBzcGVjaWFsIGNhc2UuXG4gICAgICAgIC8vIFdlIGhhdmUgdG8gZ3JhYiBlYWNoIGNoZWNrZWQgdmFsdWVzXG4gICAgICAgIC8vIGFuZCBwdXQgdGhlbSBpbnRvIGFuIGFycmF5LlxuICAgICAgICBpZiAoKDAsIGRvbV8xLmlzQ2hlY2tib3gpKCRkb21Ob2RlKSkge1xuICAgICAgICAgICAgaWYgKGRvbU5vZGVWYWx1ZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtRWxlbWVudEhhc1NpYmxpbmdzKCRkb21Ob2RlKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdFtrZXldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHRba2V5XS5wdXNoKGRvbU5vZGVWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IGRvbU5vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gTXVsdGlwbGUgc2VsZWN0IGlzIGEgc3BlY2lhbCBjYXNlLlxuICAgICAgICAvLyBXZSBoYXZlIHRvIGdyYWIgZWFjaCBzZWxlY3RlZCBvcHRpb24gYW5kIHB1dCB0aGVtIGludG8gYW4gYXJyYXkuXG4gICAgICAgIGlmICgoMCwgZG9tXzEuaXNTZWxlY3RNdWx0aXBsZSkoJGRvbU5vZGUpKSB7XG4gICAgICAgICAgICBpZiAoZG9tTm9kZVZhbHVlICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gZG9tTm9kZVZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEZhbGxiYWNrIG9yIG90aGVyIGNhc2VzIHRoYXQgZG9uJ3RcbiAgICAgICAgLy8gbmVlZCBzcGVjaWFsIHRyZWF0bWVudCBvZiB0aGUgdmFsdWUuXG4gICAgICAgIHJlc3VsdFtrZXldID0gZG9tTm9kZVZhbHVlO1xuICAgICAgICByZXR1cm4gZG9tTm9kZVZhbHVlO1xuICAgIH1cbiAgICBwcm9jZXNzTXVsdGlMZXZlbE5vZGUoJGRvbU5vZGUsIGFyciwgdmFsdWUsIHJlc3VsdCkge1xuICAgICAgICBjb25zdCBrZXlOYW1lID0gYXJyWzBdO1xuICAgICAgICBpZiAoYXJyLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGlmIChrZXlOYW1lID09PSAnW10nKSB7XG4gICAgICAgICAgICAgICAgLy9yZXN1bHQucHVzaCh7fSk7XG4gICAgICAgICAgICAgICAgcmVzdWx0WygwLCB1dGlsc18xLmdldE5leHRJbnRlZ2VyS2V5KShyZXN1bHQpXSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc011bHRpTGV2ZWxOb2RlKCRkb21Ob2RlLCBhcnIuc3BsaWNlKDEsIGFyci5sZW5ndGgpLCB2YWx1ZSwgcmVzdWx0WygwLCB1dGlsc18xLmdldExhc3RJbnRlZ2VyS2V5KShyZXN1bHQpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0W2tleU5hbWVdICYmICgwLCB1dGlsc18xLmdldE9iakxlbmd0aCkocmVzdWx0W2tleU5hbWVdKSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy9yZXN1bHRba2V5TmFtZV0ucHVzaChudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc011bHRpTGV2ZWxOb2RlKCRkb21Ob2RlLCBhcnIuc3BsaWNlKDEsIGFyci5sZW5ndGgpLCB2YWx1ZSwgcmVzdWx0W2tleU5hbWVdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXlOYW1lXSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NNdWx0aUxldmVsTm9kZSgkZG9tTm9kZSwgYXJyLnNwbGljZSgxLCBhcnIubGVuZ3RoKSwgdmFsdWUsIHJlc3VsdFtrZXlOYW1lXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gTGFzdCBrZXksIGF0dGFjaCB0aGUgb3JpZ2luYWwgdmFsdWUuXG4gICAgICAgIGlmIChhcnIubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBpZiAoa2V5TmFtZSA9PT0gJ1tdJykge1xuICAgICAgICAgICAgICAgIC8vcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICAgICAgICAgIHJlc3VsdFsoMCwgdXRpbHNfMS5nZXROZXh0SW50ZWdlcktleSkocmVzdWx0KV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzU2luZ2xlTGV2ZWxOb2RlKCRkb21Ob2RlLCBhcnIsIHZhbHVlLCByZXN1bHQpO1xuICAgICAgICAgICAgICAgIC8vICByZXN1bHRba2V5TmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZvcm1FbGVtZW50SGFzU2libGluZ3MoJGRvbU5vZGUpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9ICRkb21Ob2RlLm5hbWU7XG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuZmlsdGVyLmNhbGwodGhpcy4kZm9ybUVsZW1lbnRzLCAoaW5wdXQpID0+IHsgcmV0dXJuIGlucHV0Lm5hbWUgPT09IG5hbWU7IH0pLmxlbmd0aCA+IDE7XG4gICAgfVxufVxuZXhwb3J0cy5Gb3JtVG9PYmplY3QgPSBGb3JtVG9PYmplY3Q7XG4vLyBDdXJyZW50bHkgbWF0Y2hpbmcgb25seSBmaWVsZHMgbGlrZSAnZmllbGROYW1lWy4uLl0gb3IgZmllbGROYW1lW10nLlxuRm9ybVRvT2JqZWN0LmtleVJlZ2V4ID0gL1teW1xcXV0rfFxcW10vZztcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pc0ZpbGVMaXN0ID0gZXhwb3J0cy5pc0NoZWNrZWQgPSBleHBvcnRzLmlzU3VibWl0QnV0dG9uID0gZXhwb3J0cy5pc1NlbGVjdE11bHRpcGxlID0gZXhwb3J0cy5pc1NlbGVjdFNpbXBsZSA9IGV4cG9ydHMuaXNUZXh0YXJlYSA9IGV4cG9ydHMuaXNGaWxlRmllbGQgPSBleHBvcnRzLmlzQ2hlY2tib3ggPSBleHBvcnRzLmlzUmFkaW8gPSBleHBvcnRzLmlzVXBsb2FkRm9ybSA9IGV4cG9ydHMuaXNEb21FbGVtZW50Tm9kZSA9IHZvaWQgMDtcbi8qKlxuICogQ2hlY2sgdG8gc2VlIGlmIHRoZSBvYmplY3QgaXMgYW4gSFRNTCBub2RlLlxuICpcbiAqIEBwYXJhbSB7SFRNTEZvcm1FbGVtZW50IHwgSFRNTEVsZW1lbnR9IG5vZGVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc0RvbUVsZW1lbnROb2RlKG5vZGUpIHtcbiAgICByZXR1cm4gKEJvb2xlYW4obm9kZSkgJiYgdHlwZW9mIG5vZGUgPT09ICdvYmplY3QnICYmICdub2RlVHlwZScgaW4gbm9kZSAmJiBub2RlLm5vZGVUeXBlID09PSAxKTtcbn1cbmV4cG9ydHMuaXNEb21FbGVtZW50Tm9kZSA9IGlzRG9tRWxlbWVudE5vZGU7XG5mdW5jdGlvbiBpc1VwbG9hZEZvcm0oJGZvcm0pIHtcbiAgICByZXR1cm4gQm9vbGVhbigkZm9ybS5lbmN0eXBlICYmICRmb3JtLmVuY3R5cGUgPT09ICdtdWx0aXBhcnQvZm9ybS1kYXRhJyk7XG59XG5leHBvcnRzLmlzVXBsb2FkRm9ybSA9IGlzVXBsb2FkRm9ybTtcbmZ1bmN0aW9uIGlzUmFkaW8oJGRvbU5vZGUpIHtcbiAgICByZXR1cm4gJGRvbU5vZGUubm9kZU5hbWUgPT09ICdJTlBVVCcgJiYgJGRvbU5vZGUudHlwZSA9PT0gJ3JhZGlvJztcbn1cbmV4cG9ydHMuaXNSYWRpbyA9IGlzUmFkaW87XG5mdW5jdGlvbiBpc0NoZWNrYm94KCRkb21Ob2RlKSB7XG4gICAgcmV0dXJuICRkb21Ob2RlLm5vZGVOYW1lID09PSAnSU5QVVQnICYmICRkb21Ob2RlLnR5cGUgPT09ICdjaGVja2JveCc7XG59XG5leHBvcnRzLmlzQ2hlY2tib3ggPSBpc0NoZWNrYm94O1xuZnVuY3Rpb24gaXNGaWxlRmllbGQoJGRvbU5vZGUpIHtcbiAgICByZXR1cm4gJGRvbU5vZGUubm9kZU5hbWUgPT09ICdJTlBVVCcgJiYgJGRvbU5vZGUudHlwZSA9PT0gJ2ZpbGUnO1xufVxuZXhwb3J0cy5pc0ZpbGVGaWVsZCA9IGlzRmlsZUZpZWxkO1xuZnVuY3Rpb24gaXNUZXh0YXJlYSgkZG9tTm9kZSkge1xuICAgIHJldHVybiAkZG9tTm9kZS5ub2RlTmFtZSA9PT0gJ1RFWFRBUkVBJztcbn1cbmV4cG9ydHMuaXNUZXh0YXJlYSA9IGlzVGV4dGFyZWE7XG5mdW5jdGlvbiBpc1NlbGVjdFNpbXBsZSgkZG9tTm9kZSkge1xuICAgIHJldHVybiAkZG9tTm9kZS5ub2RlTmFtZSA9PT0gJ1NFTEVDVCcgJiYgJGRvbU5vZGUudHlwZSA9PT0gJ3NlbGVjdC1vbmUnO1xufVxuZXhwb3J0cy5pc1NlbGVjdFNpbXBsZSA9IGlzU2VsZWN0U2ltcGxlO1xuZnVuY3Rpb24gaXNTZWxlY3RNdWx0aXBsZSgkZG9tTm9kZSkge1xuICAgIHJldHVybiAkZG9tTm9kZS5ub2RlTmFtZSA9PT0gJ1NFTEVDVCcgJiYgJGRvbU5vZGUudHlwZSA9PT0gJ3NlbGVjdC1tdWx0aXBsZSc7XG59XG5leHBvcnRzLmlzU2VsZWN0TXVsdGlwbGUgPSBpc1NlbGVjdE11bHRpcGxlO1xuZnVuY3Rpb24gaXNTdWJtaXRCdXR0b24oJGRvbU5vZGUpIHtcbiAgICByZXR1cm4gJGRvbU5vZGUubm9kZU5hbWUgPT09ICdCVVRUT04nICYmICRkb21Ob2RlLnR5cGUgPT09ICdzdWJtaXQnO1xufVxuZXhwb3J0cy5pc1N1Ym1pdEJ1dHRvbiA9IGlzU3VibWl0QnV0dG9uO1xuZnVuY3Rpb24gaXNDaGVja2VkKCRkb21Ob2RlKSB7XG4gICAgcmV0dXJuICRkb21Ob2RlLmNoZWNrZWQ7XG59XG5leHBvcnRzLmlzQ2hlY2tlZCA9IGlzQ2hlY2tlZDtcbi8vZnVuY3Rpb24gaXNNdWx0aXBsZSgkZG9tTm9kZSl7XG4vLyAgcmV0dXJuICgkZG9tTm9kZS5tdWx0aXBsZSA/IHRydWUgOiBmYWxzZSk7XG4vL31cbmZ1bmN0aW9uIGlzRmlsZUxpc3QoJGRvbU5vZGUpIHtcbiAgICByZXR1cm4gKHdpbmRvdy5GaWxlTGlzdCAmJiAoJGRvbU5vZGUuZmlsZXMgaW5zdGFuY2VvZiB3aW5kb3cuRmlsZUxpc3QpKTtcbn1cbmV4cG9ydHMuaXNGaWxlTGlzdCA9IGlzRmlsZUxpc3Q7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZm9yRWFjaCA9IGV4cG9ydHMuZXh0ZW5kID0gZXhwb3J0cy5nZXRPYmpMZW5ndGggPSBleHBvcnRzLmdldE5leHRJbnRlZ2VyS2V5ID0gZXhwb3J0cy5nZXRMYXN0SW50ZWdlcktleSA9IGV4cG9ydHMuY2hlY2tGb3JMYXN0TnVtZXJpY0tleSA9IHZvaWQgMDtcbi8qKlxuICogQ2hlY2sgZm9yIGxhc3QgbnVtZXJpYyBrZXkuXG4gKi9cbmZ1bmN0aW9uIGNoZWNrRm9yTGFzdE51bWVyaWNLZXkobykge1xuICAgIGlmICghbyB8fCB0eXBlb2YgbyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0LmtleXMobykuZmlsdGVyKGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgICAgIHJldHVybiAhaXNOYU4ocGFyc2VJbnQoZWxlbSwgMTApKTtcbiAgICB9KS5zcGxpY2UoLTEpWzBdO1xufVxuZXhwb3J0cy5jaGVja0Zvckxhc3ROdW1lcmljS2V5ID0gY2hlY2tGb3JMYXN0TnVtZXJpY0tleTtcbi8qKlxuICogR2V0IGxhc3QgbnVtZXJpYyBrZXkgZnJvbSBhbiBvYmplY3QuXG4gKiBAcGFyYW0gbyBvYmplY3RcbiAqIEByZXR1cm4gaW50XG4gKi9cbmZ1bmN0aW9uIGdldExhc3RJbnRlZ2VyS2V5KG8pIHtcbiAgICBjb25zdCBsYXN0S2V5SW5kZXggPSBjaGVja0Zvckxhc3ROdW1lcmljS2V5KG8pO1xuICAgIGlmICh0eXBlb2YgbGFzdEtleUluZGV4ID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQobGFzdEtleUluZGV4LCAxMCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG59XG5leHBvcnRzLmdldExhc3RJbnRlZ2VyS2V5ID0gZ2V0TGFzdEludGVnZXJLZXk7XG4vKipcbiAqIEdldCB0aGUgbmV4dCBudW1lcmljIGtleSAobGlrZSB0aGUgaW5kZXggZnJvbSBhIFBIUCBhcnJheSlcbiAqIEBwYXJhbSBvIG9iamVjdFxuICogQHJldHVybiBpbnRcbiAqL1xuZnVuY3Rpb24gZ2V0TmV4dEludGVnZXJLZXkobykge1xuICAgIGNvbnN0IGxhc3RLZXlJbmRleCA9IGNoZWNrRm9yTGFzdE51bWVyaWNLZXkobyk7XG4gICAgaWYgKHR5cGVvZiBsYXN0S2V5SW5kZXggPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUludChsYXN0S2V5SW5kZXgsIDEwKSArIDE7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG59XG5leHBvcnRzLmdldE5leHRJbnRlZ2VyS2V5ID0gZ2V0TmV4dEludGVnZXJLZXk7XG4vKipcbiAqIEdldCB0aGUgcmVhbCBudW1iZXIgb2YgcHJvcGVydGllcyBmcm9tIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb1xuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gZ2V0T2JqTGVuZ3RoKG8pIHtcbiAgICBpZiAodHlwZW9mIG8gIT09ICdvYmplY3QnIHx8IG8gPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGxldCBsID0gMDtcbiAgICBsZXQgaztcbiAgICBpZiAodHlwZW9mIE9iamVjdC5rZXlzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGwgPSBPYmplY3Qua2V5cyhvKS5sZW5ndGg7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmb3IgKGsgaW4gbykge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBrKSkge1xuICAgICAgICAgICAgICAgIGwrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbDtcbn1cbmV4cG9ydHMuZ2V0T2JqTGVuZ3RoID0gZ2V0T2JqTGVuZ3RoO1xuLyoqXG4gKiBTaW1wbGUgZXh0ZW5kIG9mIG93biBwcm9wZXJ0aWVzLlxuICogTmVlZGVkIGZvciBvdXIgc2V0dGluZ3MuXG4gKlxuICogQHBhcmFtIHtJRm9ybVRvT2JqZWN0T3B0aW9uc30gc2V0dGluZ3NcbiAqIEBwYXJhbSAge0lGb3JtVG9PYmplY3RPcHRpb25zfSBzb3VyY2UgVGhlIG9iamVjdCB3aXRoIG5ldyBwcm9wZXJ0aWVzIHRoYXQgd2Ugd2FudCB0byBhZGQgdGhlIGRlc3RpbmF0aW9uLlxuICogQHJldHVybiB7SUZvcm1Ub09iamVjdE9wdGlvbnN9XG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChzZXR0aW5ncywgc291cmNlKSB7XG4gICAgbGV0IGk7XG4gICAgZm9yIChpIGluIHNvdXJjZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwgaSkpIHtcbiAgICAgICAgICAgIHNldHRpbmdzW2ldID0gc291cmNlW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzZXR0aW5ncztcbn1cbmV4cG9ydHMuZXh0ZW5kID0gZXh0ZW5kO1xuLy8gSXRlcmF0aW9uIHRocm91Z2ggY29sbGVjdGlvbnMuIENvbXBhdGlibGUgd2l0aCBJRS5cbmZ1bmN0aW9uIGZvckVhY2goYXJyLCBjYWxsYmFjaykge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGFyciwgY2FsbGJhY2spO1xufVxuZXhwb3J0cy5mb3JFYWNoID0gZm9yRWFjaDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IEZvcm1Ub09iamVjdF8xID0gcmVxdWlyZShcIi4vRm9ybVRvT2JqZWN0XCIpO1xuZnVuY3Rpb24gZm9ybVRvT2JqZWN0KHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBuZXcgRm9ybVRvT2JqZWN0XzEuRm9ybVRvT2JqZWN0KHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlLmNvbnZlcnRUb09iaigpO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnZm9ybVRvT2JqZWN0IEVSUk9SOicsIGUubWVzc2FnZSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBmb3JtVG9PYmplY3Q7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=