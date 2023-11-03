/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/FormToObject.ts":
/*!*****************************!*\
  !*** ./src/FormToObject.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FormToObject = void 0;
var dom_1 = __webpack_require__(/*! ./dom */ "./src/dom.ts");
var utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
var FormToObject = /** @class */ (function () {
    function FormToObject(selector, options) {
        this.formSelector = '';
        this.$form = null;
        this.$formElements = [];
        // Experimental. Don't rely on them yet.
        this.settings = {
            includeEmptyValuedElements: false,
            w3cSuccessfulControlsOnly: false
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
    FormToObject.prototype.initForm = function () {
        if (typeof this.formSelector === 'string') {
            this.$form = document.getElementById(this.formSelector);
            return (0, dom_1.isDomElementNode)(this.$form);
        }
        else if ((0, dom_1.isDomElementNode)(this.formSelector)) { // @todo: Should I check for DOM.nodeType?
            this.$form = this.formSelector;
            return true;
        }
        return false;
    };
    // Set the elements we need to parse.
    FormToObject.prototype.initFormElements = function () {
        var _a;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.$formElements = __spreadArray([], (((_a = this.$form) === null || _a === void 0 ? void 0 : _a.querySelectorAll('input, textarea, select')) || []), true);
        return this.$formElements.length > 0;
    };
    FormToObject.prototype.convertToObj = function () {
        var i = 0;
        var objKeyNames;
        var $domNode;
        var domNodeValue;
        var result = Object.create(null);
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
        var resultLength = (0, utils_1.getObjLength)(result);
        return resultLength > 0 ? result : false;
    };
    FormToObject.prototype.getNodeValues = function ($domNode) {
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
                var values_1 = [];
                (0, utils_1.forEach)($domNode.options, function ($option) {
                    if ($option.selected) {
                        values_1.push($option.value);
                    }
                });
                if (this.settings.includeEmptyValuedElements) {
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
    };
    FormToObject.prototype.processSingleLevelNode = function ($domNode, arr, domNodeValue, result) {
        // Get the last remaining key.
        var key = arr[0];
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
    };
    FormToObject.prototype.processMultiLevelNode = function ($domNode, arr, value, result) {
        var keyName = arr[0];
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
    };
    FormToObject.prototype.formElementHasSiblings = function ($domNode) {
        var name = $domNode.name;
        return Array.prototype.filter.call(this.$formElements, function (input) { return input.name === name; }).length > 1;
    };
    // Currently matching only fields like 'fieldName[...] or fieldName[]'.
    FormToObject.keyRegex = /[^[\]]+|\[]/g;
    return FormToObject;
}());
exports.FormToObject = FormToObject;


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
    return (node && typeof node === 'object' && 'nodeType' in node && node.nodeType === 1);
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

/***/ "./src/expose-to-browser.ts":
/*!**********************************!*\
  !*** ./src/expose-to-browser.ts ***!
  \**********************************/
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var index_1 = __importDefault(__webpack_require__(/*! ./index */ "./src/index.ts"));
(function (window) {
    'use strict';
    if ( true && (__webpack_require__.amdD === null || __webpack_require__.amdD === void 0 ? void 0 : __webpack_require__.amdO)) {
        // AMD/requirejs: Define the module
        !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
            return index_1.default;
        }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
    else if ( true && (module === null || module === void 0 ? void 0 : module.exports)) {
        module.exports = index_1.default;
    }
    else {
        // Browser: Expose to window
        window['formToObject'] = index_1.default;
    }
})(window);


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var FormToObject_1 = __webpack_require__(/*! ./FormToObject */ "./src/FormToObject.ts");
function formToObject(selector, options) {
    var instance = new FormToObject_1.FormToObject(selector, options);
    return instance.convertToObj();
}
exports["default"] = formToObject;


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
 * @param {IFormToObjectOptions} settings
 * @param  {IFormToObjectOptions} source The object with new properties that we want to add the destination.
 * @return {IFormToObjectOptions}
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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLHNCQUFzQjtBQUNqQyxZQUFZLHNCQUFzQjtBQUNsQyxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlOzs7Ozs7O1VDNUZmO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N6QkE7V0FDQTtXQUNBOzs7OztXQ0ZBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1VFSkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mb3JtX3RvX29iamVjdC8uL3NyYy9Gb3JtVG9PYmplY3QudHMiLCJ3ZWJwYWNrOi8vZm9ybV90b19vYmplY3QvLi9zcmMvZG9tLnRzIiwid2VicGFjazovL2Zvcm1fdG9fb2JqZWN0Ly4vc3JjL2V4cG9zZS10by1icm93c2VyLnRzIiwid2VicGFjazovL2Zvcm1fdG9fb2JqZWN0Ly4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL2Zvcm1fdG9fb2JqZWN0Ly4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL2Zvcm1fdG9fb2JqZWN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Zvcm1fdG9fb2JqZWN0L3dlYnBhY2svcnVudGltZS9hbWQgZGVmaW5lIiwid2VicGFjazovL2Zvcm1fdG9fb2JqZWN0L3dlYnBhY2svcnVudGltZS9hbWQgb3B0aW9ucyIsIndlYnBhY2s6Ly9mb3JtX3RvX29iamVjdC93ZWJwYWNrL3J1bnRpbWUvbm9kZSBtb2R1bGUgZGVjb3JhdG9yIiwid2VicGFjazovL2Zvcm1fdG9fb2JqZWN0L3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vZm9ybV90b19vYmplY3Qvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2Zvcm1fdG9fb2JqZWN0L3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbnZhciBfX3NwcmVhZEFycmF5ID0gKHRoaXMgJiYgdGhpcy5fX3NwcmVhZEFycmF5KSB8fCBmdW5jdGlvbiAodG8sIGZyb20sIHBhY2spIHtcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuRm9ybVRvT2JqZWN0ID0gdm9pZCAwO1xudmFyIGRvbV8xID0gcmVxdWlyZShcIi4vZG9tXCIpO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBGb3JtVG9PYmplY3QgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRm9ybVRvT2JqZWN0KHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuZm9ybVNlbGVjdG9yID0gJyc7XG4gICAgICAgIHRoaXMuJGZvcm0gPSBudWxsO1xuICAgICAgICB0aGlzLiRmb3JtRWxlbWVudHMgPSBbXTtcbiAgICAgICAgLy8gRXhwZXJpbWVudGFsLiBEb24ndCByZWx5IG9uIHRoZW0geWV0LlxuICAgICAgICB0aGlzLnNldHRpbmdzID0ge1xuICAgICAgICAgICAgaW5jbHVkZUVtcHR5VmFsdWVkRWxlbWVudHM6IGZhbHNlLFxuICAgICAgICAgICAgdzNjU3VjY2Vzc2Z1bENvbnRyb2xzT25seTogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgICAgLy8gQXNzaWduIHRoZSBjdXJyZW50IGZvcm0gcmVmZXJlbmNlLlxuICAgICAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHNlbGVjdG9yIHdhcyBwYXNzZWQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVGhlIGZvcm0gcmVmZXJlbmNlIGlzIGFsd2F5cyB0aGUgZmlyc3QgcGFyYW1ldGVyIG9mIHRoZSBtZXRob2QuXG4gICAgICAgIC8vIEVnOiBmb3JtVG9PYmplY3QoJ215Rm9ybScpXG4gICAgICAgIHRoaXMuZm9ybVNlbGVjdG9yID0gc2VsZWN0b3I7XG4gICAgICAgIC8vIE92ZXJyaWRlIGN1cnJlbnQgc2V0dGluZ3MuXG4gICAgICAgIC8vIEVnLiBmb3JtVG9PYmplY3QoJ215Rm9ybScsIHtteVNldHRpbmc6IHRydWV9KVxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgIT09ICd1bmRlZmluZWQnICYmICgwLCB1dGlsc18xLmdldE9iakxlbmd0aCkob3B0aW9ucykgPiAwKSB7XG4gICAgICAgICAgICAoMCwgdXRpbHNfMS5leHRlbmQpKHRoaXMuc2V0dGluZ3MsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5pbml0Rm9ybSgpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSA8Zm9ybT4gRE9NIGVsZW1lbnQgY291bGQgbm90IGJlIGZvdW5kLicpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5pbml0Rm9ybUVsZW1lbnRzKCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gPGZvcm0+IERPTSBlbGVtZW50cyB3ZXJlIGZvdW5kLiBGb3JtIGlzIGVtcHR5LicpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFuIEhUTUwgPGZvcm0+IGNhbiBiZSBpbml0aWFsaXplZCB3aXRoIGEgc3RyaW5nIERPTSBzZWxlY3RvciBlLmcuICcubXlGb3JtJ1xuICAgICAqIG9yIGEgRE9NIG9iamVjdCByZWZlcmVuY2UuXG4gICAgICovXG4gICAgRm9ybVRvT2JqZWN0LnByb3RvdHlwZS5pbml0Rm9ybSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmZvcm1TZWxlY3RvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRoaXMuJGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmZvcm1TZWxlY3Rvcik7XG4gICAgICAgICAgICByZXR1cm4gKDAsIGRvbV8xLmlzRG9tRWxlbWVudE5vZGUpKHRoaXMuJGZvcm0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCgwLCBkb21fMS5pc0RvbUVsZW1lbnROb2RlKSh0aGlzLmZvcm1TZWxlY3RvcikpIHsgLy8gQHRvZG86IFNob3VsZCBJIGNoZWNrIGZvciBET00ubm9kZVR5cGU/XG4gICAgICAgICAgICB0aGlzLiRmb3JtID0gdGhpcy5mb3JtU2VsZWN0b3I7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICAvLyBTZXQgdGhlIGVsZW1lbnRzIHdlIG5lZWQgdG8gcGFyc2UuXG4gICAgRm9ybVRvT2JqZWN0LnByb3RvdHlwZS5pbml0Rm9ybUVsZW1lbnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB0aGlzLiRmb3JtRWxlbWVudHMgPSBfX3NwcmVhZEFycmF5KFtdLCAoKChfYSA9IHRoaXMuJGZvcm0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCwgdGV4dGFyZWEsIHNlbGVjdCcpKSB8fCBbXSksIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcy4kZm9ybUVsZW1lbnRzLmxlbmd0aCA+IDA7XG4gICAgfTtcbiAgICBGb3JtVG9PYmplY3QucHJvdG90eXBlLmNvbnZlcnRUb09iaiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB2YXIgb2JqS2V5TmFtZXM7XG4gICAgICAgIHZhciAkZG9tTm9kZTtcbiAgICAgICAgdmFyIGRvbU5vZGVWYWx1ZTtcbiAgICAgICAgdmFyIHJlc3VsdCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLiRmb3JtRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICRkb21Ob2RlID0gdGhpcy4kZm9ybUVsZW1lbnRzW2ldO1xuICAgICAgICAgICAgLy8gU2tpcCB0aGUgZWxlbWVudCBpZiB0aGUgJ25hbWUnIGF0dHJpYnV0ZSBpcyBlbXB0eS5cbiAgICAgICAgICAgIC8vIFNraXAgdGhlICdkaXNhYmxlZCcgZWxlbWVudHMuXG4gICAgICAgICAgICAvLyBTa2lwIHRoZSBub24tc2VsZWN0ZWQgcmFkaW8gZWxlbWVudHMuXG4gICAgICAgICAgICBpZiAoISRkb21Ob2RlLm5hbWUgfHxcbiAgICAgICAgICAgICAgICAkZG9tTm9kZS5uYW1lID09PSAnJyB8fFxuICAgICAgICAgICAgICAgICRkb21Ob2RlLmRpc2FibGVkIHx8XG4gICAgICAgICAgICAgICAgKCgwLCBkb21fMS5pc1JhZGlvKSgkZG9tTm9kZSkgJiYgISgwLCBkb21fMS5pc0NoZWNrZWQpKCRkb21Ob2RlKSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEdldCB0aGUgZmluYWwgcHJvY2Vzc2VkIGRvbU5vZGUgdmFsdWUuXG4gICAgICAgICAgICBkb21Ob2RlVmFsdWUgPSB0aGlzLmdldE5vZGVWYWx1ZXMoJGRvbU5vZGUpO1xuICAgICAgICAgICAgLy8gRXhjbHVkZSBlbXB0eSB2YWx1ZWQgbm9kZXMgaWYgdGhlIHNldHRpbmdzIGFsbG93IGl0LlxuICAgICAgICAgICAgaWYgKGRvbU5vZGVWYWx1ZSA9PT0gZmFsc2UgJiYgIXRoaXMuc2V0dGluZ3MuaW5jbHVkZUVtcHR5VmFsdWVkRWxlbWVudHMpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEV4dHJhY3QgYWxsIHBvc3NpYmxlIGtleXNcbiAgICAgICAgICAgIC8vIEUuZy4gbmFtZT1cImZpcnN0TmFtZVwiLCBuYW1lPVwic2V0dGluZ3NbYV1bYl1cIiwgbmFtZT1cInNldHRpbmdzWzBdW2FdXCJcbiAgICAgICAgICAgIG9iaktleU5hbWVzID0gJGRvbU5vZGUubmFtZS5tYXRjaChGb3JtVG9PYmplY3Qua2V5UmVnZXgpO1xuICAgICAgICAgICAgaWYgKG9iaktleU5hbWVzICYmIG9iaktleU5hbWVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc1NpbmdsZUxldmVsTm9kZSgkZG9tTm9kZSwgb2JqS2V5TmFtZXMsIChkb21Ob2RlVmFsdWUgPyBkb21Ob2RlVmFsdWUgOiAnJyksIHJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob2JqS2V5TmFtZXMgJiYgb2JqS2V5TmFtZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc011bHRpTGV2ZWxOb2RlKCRkb21Ob2RlLCBvYmpLZXlOYW1lcywgKGRvbU5vZGVWYWx1ZSA/IGRvbU5vZGVWYWx1ZSA6ICcnKSwgcmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBDaGVjayB0aGUgbGVuZ3RoIG9mIHRoZSByZXN1bHQuXG4gICAgICAgIHZhciByZXN1bHRMZW5ndGggPSAoMCwgdXRpbHNfMS5nZXRPYmpMZW5ndGgpKHJlc3VsdCk7XG4gICAgICAgIHJldHVybiByZXN1bHRMZW5ndGggPiAwID8gcmVzdWx0IDogZmFsc2U7XG4gICAgfTtcbiAgICBGb3JtVG9PYmplY3QucHJvdG90eXBlLmdldE5vZGVWYWx1ZXMgPSBmdW5jdGlvbiAoJGRvbU5vZGUpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICAvLyBXZSdyZSBvbmx5IGludGVyZXN0ZWQgaW4gdGhlIHJhZGlvIHRoYXQgaXMgY2hlY2tlZC5cbiAgICAgICAgaWYgKCgwLCBkb21fMS5pc1JhZGlvKSgkZG9tTm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAoMCwgZG9tXzEuaXNDaGVja2VkKSgkZG9tTm9kZSkgPyAkZG9tTm9kZS52YWx1ZSA6IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8vIFdlJ3JlIG9ubHkgaW50ZXJlc3RlZCBpbiB0aGUgY2hlY2tib3ggdGhhdCBpcyBjaGVja2VkLlxuICAgICAgICBpZiAoKDAsIGRvbV8xLmlzQ2hlY2tib3gpKCRkb21Ob2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuICgwLCBkb21fMS5pc0NoZWNrZWQpKCRkb21Ob2RlKSA/ICRkb21Ob2RlLnZhbHVlIDogZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRmlsZSBpbnB1dHMgYXJlIGEgc3BlY2lhbCBjYXNlLlxuICAgICAgICAvLyBXZSBoYXZlIHRvIGdyYWIgdGhlIC5maWxlcyBwcm9wZXJ0eSBvZiB0aGUgaW5wdXQsIHdoaWNoIGlzIGEgRmlsZUxpc3QuXG4gICAgICAgIGlmICgoMCwgZG9tXzEuaXNGaWxlRmllbGQpKCRkb21Ob2RlKSkge1xuICAgICAgICAgICAgLy8gSWdub3JlIGlucHV0IGZpbGUgZmllbGRzIGlmIHRoZSBmb3JtIGlzIG5vdCBlbmNvZGVkIHByb3Blcmx5LlxuICAgICAgICAgICAgaWYgKCgwLCBkb21fMS5pc1VwbG9hZEZvcm0pKHRoaXMuJGZvcm0pKSB7XG4gICAgICAgICAgICAgICAgLy8gSFRNTDUgY29tcGF0aWJsZSBicm93c2VyLlxuICAgICAgICAgICAgICAgIGlmICgoMCwgZG9tXzEuaXNGaWxlTGlzdCkoJGRvbU5vZGUpICYmICgoX2EgPSAkZG9tTm9kZSA9PT0gbnVsbCB8fCAkZG9tTm9kZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogJGRvbU5vZGUuZmlsZXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5sZW5ndGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkZG9tTm9kZS5maWxlcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoJGRvbU5vZGUudmFsdWUgJiYgJGRvbU5vZGUudmFsdWUgIT09ICcnID9cbiAgICAgICAgICAgICAgICAgICAgICAgICRkb21Ob2RlLnZhbHVlIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2UncmUgb25seSBpbnRlcmVzdGVkIGluIHRleHRhcmVhIGZpZWxkcyB0aGF0IGhhdmUgdmFsdWVzLlxuICAgICAgICBpZiAoKDAsIGRvbV8xLmlzVGV4dGFyZWEpKCRkb21Ob2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuICgkZG9tTm9kZS52YWx1ZSAmJiAkZG9tTm9kZS52YWx1ZSAhPT0gJycgP1xuICAgICAgICAgICAgICAgICRkb21Ob2RlLnZhbHVlIDpcbiAgICAgICAgICAgICAgICBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCgwLCBkb21fMS5pc1NlbGVjdFNpbXBsZSkoJGRvbU5vZGUpKSB7XG4gICAgICAgICAgICBpZiAoJGRvbU5vZGUudmFsdWUgJiYgJGRvbU5vZGUudmFsdWUgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRkb21Ob2RlLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoJGRvbU5vZGUub3B0aW9ucyAmJlxuICAgICAgICAgICAgICAgICRkb21Ob2RlLm9wdGlvbnMubGVuZ3RoICYmXG4gICAgICAgICAgICAgICAgJGRvbU5vZGUub3B0aW9uc1swXS52YWx1ZSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGRvbU5vZGUub3B0aW9uc1swXS52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBXZSdyZSBvbmx5IGludGVyZXN0ZWQgaW4gbXVsdGlwbGUgc2VsZWN0cyB0aGF0IGhhdmUgYXQgbGVhc3Qgb25lIG9wdGlvbiBzZWxlY3RlZC5cbiAgICAgICAgaWYgKCgwLCBkb21fMS5pc1NlbGVjdE11bHRpcGxlKSgkZG9tTm9kZSkpIHtcbiAgICAgICAgICAgIGlmICgkZG9tTm9kZS5vcHRpb25zICYmICRkb21Ob2RlLm9wdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZXNfMSA9IFtdO1xuICAgICAgICAgICAgICAgICgwLCB1dGlsc18xLmZvckVhY2gpKCRkb21Ob2RlLm9wdGlvbnMsIGZ1bmN0aW9uICgkb3B0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkb3B0aW9uLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXNfMS5wdXNoKCRvcHRpb24udmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuaW5jbHVkZUVtcHR5VmFsdWVkRWxlbWVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlc18xO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICh2YWx1ZXNfMS5sZW5ndGggPyB2YWx1ZXNfMSA6IGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2UncmUgb25seSBpbnRlcmVzdGVkIGlmIHRoZSBidXR0b24gaXMgdHlwZT1cInN1Ym1pdFwiXG4gICAgICAgIGlmICgoMCwgZG9tXzEuaXNTdWJtaXRCdXR0b24pKCRkb21Ob2RlKSkge1xuICAgICAgICAgICAgaWYgKCRkb21Ob2RlLnZhbHVlICYmICRkb21Ob2RlLnZhbHVlICE9PSAnJykge1xuICAgICAgICAgICAgICAgIHJldHVybiAkZG9tTm9kZS52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkZG9tTm9kZS5pbm5lclRleHQgJiYgJGRvbU5vZGUuaW5uZXJUZXh0ICE9PSAnJykge1xuICAgICAgICAgICAgICAgIHJldHVybiAkZG9tTm9kZS5pbm5lclRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRmFsbGJhY2sgb3Igb3RoZXIgbm9uLXNwZWNpYWwgZmllbGRzLlxuICAgICAgICBpZiAodHlwZW9mICRkb21Ob2RlLnZhbHVlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuaW5jbHVkZUVtcHR5VmFsdWVkRWxlbWVudHMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGRvbU5vZGUudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCRkb21Ob2RlLnZhbHVlICE9PSAnJyA/ICRkb21Ob2RlLnZhbHVlIDogZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBGb3JtVG9PYmplY3QucHJvdG90eXBlLnByb2Nlc3NTaW5nbGVMZXZlbE5vZGUgPSBmdW5jdGlvbiAoJGRvbU5vZGUsIGFyciwgZG9tTm9kZVZhbHVlLCByZXN1bHQpIHtcbiAgICAgICAgLy8gR2V0IHRoZSBsYXN0IHJlbWFpbmluZyBrZXkuXG4gICAgICAgIHZhciBrZXkgPSBhcnJbMF07XG4gICAgICAgIC8vIFdlJ3JlIG9ubHkgaW50ZXJlc3RlZCBpbiB0aGUgcmFkaW8gdGhhdCBpcyBjaGVja2VkLlxuICAgICAgICBpZiAoKDAsIGRvbV8xLmlzUmFkaW8pKCRkb21Ob2RlKSkge1xuICAgICAgICAgICAgaWYgKGRvbU5vZGVWYWx1ZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IGRvbU5vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9tTm9kZVZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIENoZWNrYm94ZXMgYXJlIGEgc3BlY2lhbCBjYXNlLlxuICAgICAgICAvLyBXZSBoYXZlIHRvIGdyYWIgZWFjaCBjaGVja2VkIHZhbHVlc1xuICAgICAgICAvLyBhbmQgcHV0IHRoZW0gaW50byBhbiBhcnJheS5cbiAgICAgICAgaWYgKCgwLCBkb21fMS5pc0NoZWNrYm94KSgkZG9tTm9kZSkpIHtcbiAgICAgICAgICAgIGlmIChkb21Ob2RlVmFsdWUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9ybUVsZW1lbnRIYXNTaWJsaW5ncygkZG9tTm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXN1bHRba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0W2tleV0ucHVzaChkb21Ob2RlVmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBkb21Ob2RlVmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIE11bHRpcGxlIHNlbGVjdCBpcyBhIHNwZWNpYWwgY2FzZS5cbiAgICAgICAgLy8gV2UgaGF2ZSB0byBncmFiIGVhY2ggc2VsZWN0ZWQgb3B0aW9uIGFuZCBwdXQgdGhlbSBpbnRvIGFuIGFycmF5LlxuICAgICAgICBpZiAoKDAsIGRvbV8xLmlzU2VsZWN0TXVsdGlwbGUpKCRkb21Ob2RlKSkge1xuICAgICAgICAgICAgaWYgKGRvbU5vZGVWYWx1ZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IGRvbU5vZGVWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBGYWxsYmFjayBvciBvdGhlciBjYXNlcyB0aGF0IGRvbid0XG4gICAgICAgIC8vIG5lZWQgc3BlY2lhbCB0cmVhdG1lbnQgb2YgdGhlIHZhbHVlLlxuICAgICAgICByZXN1bHRba2V5XSA9IGRvbU5vZGVWYWx1ZTtcbiAgICAgICAgcmV0dXJuIGRvbU5vZGVWYWx1ZTtcbiAgICB9O1xuICAgIEZvcm1Ub09iamVjdC5wcm90b3R5cGUucHJvY2Vzc011bHRpTGV2ZWxOb2RlID0gZnVuY3Rpb24gKCRkb21Ob2RlLCBhcnIsIHZhbHVlLCByZXN1bHQpIHtcbiAgICAgICAgdmFyIGtleU5hbWUgPSBhcnJbMF07XG4gICAgICAgIGlmIChhcnIubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgaWYgKGtleU5hbWUgPT09ICdbXScpIHtcbiAgICAgICAgICAgICAgICAvL3Jlc3VsdC5wdXNoKHt9KTtcbiAgICAgICAgICAgICAgICByZXN1bHRbKDAsIHV0aWxzXzEuZ2V0TmV4dEludGVnZXJLZXkpKHJlc3VsdCldID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzTXVsdGlMZXZlbE5vZGUoJGRvbU5vZGUsIGFyci5zcGxpY2UoMSwgYXJyLmxlbmd0aCksIHZhbHVlLCByZXN1bHRbKDAsIHV0aWxzXzEuZ2V0TGFzdEludGVnZXJLZXkpKHJlc3VsdCldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHRba2V5TmFtZV0gJiYgKDAsIHV0aWxzXzEuZ2V0T2JqTGVuZ3RoKShyZXN1bHRba2V5TmFtZV0pID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAvL3Jlc3VsdFtrZXlOYW1lXS5wdXNoKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzTXVsdGlMZXZlbE5vZGUoJGRvbU5vZGUsIGFyci5zcGxpY2UoMSwgYXJyLmxlbmd0aCksIHZhbHVlLCByZXN1bHRba2V5TmFtZV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleU5hbWVdID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc011bHRpTGV2ZWxOb2RlKCRkb21Ob2RlLCBhcnIuc3BsaWNlKDEsIGFyci5sZW5ndGgpLCB2YWx1ZSwgcmVzdWx0W2tleU5hbWVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBMYXN0IGtleSwgYXR0YWNoIHRoZSBvcmlnaW5hbCB2YWx1ZS5cbiAgICAgICAgaWYgKGFyci5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGlmIChrZXlOYW1lID09PSAnW10nKSB7XG4gICAgICAgICAgICAgICAgLy9yZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmVzdWx0WygwLCB1dGlsc18xLmdldE5leHRJbnRlZ2VyS2V5KShyZXN1bHQpXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NTaW5nbGVMZXZlbE5vZGUoJGRvbU5vZGUsIGFyciwgdmFsdWUsIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgLy8gIHJlc3VsdFtrZXlOYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEZvcm1Ub09iamVjdC5wcm90b3R5cGUuZm9ybUVsZW1lbnRIYXNTaWJsaW5ncyA9IGZ1bmN0aW9uICgkZG9tTm9kZSkge1xuICAgICAgICB2YXIgbmFtZSA9ICRkb21Ob2RlLm5hbWU7XG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuZmlsdGVyLmNhbGwodGhpcy4kZm9ybUVsZW1lbnRzLCBmdW5jdGlvbiAoaW5wdXQpIHsgcmV0dXJuIGlucHV0Lm5hbWUgPT09IG5hbWU7IH0pLmxlbmd0aCA+IDE7XG4gICAgfTtcbiAgICAvLyBDdXJyZW50bHkgbWF0Y2hpbmcgb25seSBmaWVsZHMgbGlrZSAnZmllbGROYW1lWy4uLl0gb3IgZmllbGROYW1lW10nLlxuICAgIEZvcm1Ub09iamVjdC5rZXlSZWdleCA9IC9bXltcXF1dK3xcXFtdL2c7XG4gICAgcmV0dXJuIEZvcm1Ub09iamVjdDtcbn0oKSk7XG5leHBvcnRzLkZvcm1Ub09iamVjdCA9IEZvcm1Ub09iamVjdDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pc0ZpbGVMaXN0ID0gZXhwb3J0cy5pc0NoZWNrZWQgPSBleHBvcnRzLmlzU3VibWl0QnV0dG9uID0gZXhwb3J0cy5pc1NlbGVjdE11bHRpcGxlID0gZXhwb3J0cy5pc1NlbGVjdFNpbXBsZSA9IGV4cG9ydHMuaXNUZXh0YXJlYSA9IGV4cG9ydHMuaXNGaWxlRmllbGQgPSBleHBvcnRzLmlzQ2hlY2tib3ggPSBleHBvcnRzLmlzUmFkaW8gPSBleHBvcnRzLmlzVXBsb2FkRm9ybSA9IGV4cG9ydHMuaXNEb21FbGVtZW50Tm9kZSA9IHZvaWQgMDtcbi8qKlxuICogQ2hlY2sgdG8gc2VlIGlmIHRoZSBvYmplY3QgaXMgYW4gSFRNTCBub2RlLlxuICpcbiAqIEBwYXJhbSB7SFRNTEZvcm1FbGVtZW50IHwgSFRNTEVsZW1lbnR9IG5vZGVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc0RvbUVsZW1lbnROb2RlKG5vZGUpIHtcbiAgICByZXR1cm4gKG5vZGUgJiYgdHlwZW9mIG5vZGUgPT09ICdvYmplY3QnICYmICdub2RlVHlwZScgaW4gbm9kZSAmJiBub2RlLm5vZGVUeXBlID09PSAxKTtcbn1cbmV4cG9ydHMuaXNEb21FbGVtZW50Tm9kZSA9IGlzRG9tRWxlbWVudE5vZGU7XG5mdW5jdGlvbiBpc1VwbG9hZEZvcm0oJGZvcm0pIHtcbiAgICByZXR1cm4gQm9vbGVhbigkZm9ybS5lbmN0eXBlICYmICRmb3JtLmVuY3R5cGUgPT09ICdtdWx0aXBhcnQvZm9ybS1kYXRhJyk7XG59XG5leHBvcnRzLmlzVXBsb2FkRm9ybSA9IGlzVXBsb2FkRm9ybTtcbmZ1bmN0aW9uIGlzUmFkaW8oJGRvbU5vZGUpIHtcbiAgICByZXR1cm4gJGRvbU5vZGUubm9kZU5hbWUgPT09ICdJTlBVVCcgJiYgJGRvbU5vZGUudHlwZSA9PT0gJ3JhZGlvJztcbn1cbmV4cG9ydHMuaXNSYWRpbyA9IGlzUmFkaW87XG5mdW5jdGlvbiBpc0NoZWNrYm94KCRkb21Ob2RlKSB7XG4gICAgcmV0dXJuICRkb21Ob2RlLm5vZGVOYW1lID09PSAnSU5QVVQnICYmICRkb21Ob2RlLnR5cGUgPT09ICdjaGVja2JveCc7XG59XG5leHBvcnRzLmlzQ2hlY2tib3ggPSBpc0NoZWNrYm94O1xuZnVuY3Rpb24gaXNGaWxlRmllbGQoJGRvbU5vZGUpIHtcbiAgICByZXR1cm4gJGRvbU5vZGUubm9kZU5hbWUgPT09ICdJTlBVVCcgJiYgJGRvbU5vZGUudHlwZSA9PT0gJ2ZpbGUnO1xufVxuZXhwb3J0cy5pc0ZpbGVGaWVsZCA9IGlzRmlsZUZpZWxkO1xuZnVuY3Rpb24gaXNUZXh0YXJlYSgkZG9tTm9kZSkge1xuICAgIHJldHVybiAkZG9tTm9kZS5ub2RlTmFtZSA9PT0gJ1RFWFRBUkVBJztcbn1cbmV4cG9ydHMuaXNUZXh0YXJlYSA9IGlzVGV4dGFyZWE7XG5mdW5jdGlvbiBpc1NlbGVjdFNpbXBsZSgkZG9tTm9kZSkge1xuICAgIHJldHVybiAkZG9tTm9kZS5ub2RlTmFtZSA9PT0gJ1NFTEVDVCcgJiYgJGRvbU5vZGUudHlwZSA9PT0gJ3NlbGVjdC1vbmUnO1xufVxuZXhwb3J0cy5pc1NlbGVjdFNpbXBsZSA9IGlzU2VsZWN0U2ltcGxlO1xuZnVuY3Rpb24gaXNTZWxlY3RNdWx0aXBsZSgkZG9tTm9kZSkge1xuICAgIHJldHVybiAkZG9tTm9kZS5ub2RlTmFtZSA9PT0gJ1NFTEVDVCcgJiYgJGRvbU5vZGUudHlwZSA9PT0gJ3NlbGVjdC1tdWx0aXBsZSc7XG59XG5leHBvcnRzLmlzU2VsZWN0TXVsdGlwbGUgPSBpc1NlbGVjdE11bHRpcGxlO1xuZnVuY3Rpb24gaXNTdWJtaXRCdXR0b24oJGRvbU5vZGUpIHtcbiAgICByZXR1cm4gJGRvbU5vZGUubm9kZU5hbWUgPT09ICdCVVRUT04nICYmICRkb21Ob2RlLnR5cGUgPT09ICdzdWJtaXQnO1xufVxuZXhwb3J0cy5pc1N1Ym1pdEJ1dHRvbiA9IGlzU3VibWl0QnV0dG9uO1xuZnVuY3Rpb24gaXNDaGVja2VkKCRkb21Ob2RlKSB7XG4gICAgcmV0dXJuICRkb21Ob2RlLmNoZWNrZWQ7XG59XG5leHBvcnRzLmlzQ2hlY2tlZCA9IGlzQ2hlY2tlZDtcbi8vZnVuY3Rpb24gaXNNdWx0aXBsZSgkZG9tTm9kZSl7XG4vLyAgcmV0dXJuICgkZG9tTm9kZS5tdWx0aXBsZSA/IHRydWUgOiBmYWxzZSk7XG4vL31cbmZ1bmN0aW9uIGlzRmlsZUxpc3QoJGRvbU5vZGUpIHtcbiAgICByZXR1cm4gKHdpbmRvdy5GaWxlTGlzdCAmJiAoJGRvbU5vZGUuZmlsZXMgaW5zdGFuY2VvZiB3aW5kb3cuRmlsZUxpc3QpKTtcbn1cbmV4cG9ydHMuaXNGaWxlTGlzdCA9IGlzRmlsZUxpc3Q7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBpbmRleF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2luZGV4XCIpKTtcbihmdW5jdGlvbiAod2luZG93KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIChkZWZpbmUgPT09IG51bGwgfHwgZGVmaW5lID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkZWZpbmUuYW1kKSkge1xuICAgICAgICAvLyBBTUQvcmVxdWlyZWpzOiBEZWZpbmUgdGhlIG1vZHVsZVxuICAgICAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGluZGV4XzEuZGVmYXVsdDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIChtb2R1bGUgPT09IG51bGwgfHwgbW9kdWxlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBtb2R1bGUuZXhwb3J0cykpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBpbmRleF8xLmRlZmF1bHQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBCcm93c2VyOiBFeHBvc2UgdG8gd2luZG93XG4gICAgICAgIHdpbmRvd1snZm9ybVRvT2JqZWN0J10gPSBpbmRleF8xLmRlZmF1bHQ7XG4gICAgfVxufSkod2luZG93KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEZvcm1Ub09iamVjdF8xID0gcmVxdWlyZShcIi4vRm9ybVRvT2JqZWN0XCIpO1xuZnVuY3Rpb24gZm9ybVRvT2JqZWN0KHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gICAgdmFyIGluc3RhbmNlID0gbmV3IEZvcm1Ub09iamVjdF8xLkZvcm1Ub09iamVjdChzZWxlY3Rvciwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIGluc3RhbmNlLmNvbnZlcnRUb09iaigpO1xufVxuZXhwb3J0cy5kZWZhdWx0ID0gZm9ybVRvT2JqZWN0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmZvckVhY2ggPSBleHBvcnRzLmV4dGVuZCA9IGV4cG9ydHMuZ2V0T2JqTGVuZ3RoID0gZXhwb3J0cy5nZXROZXh0SW50ZWdlcktleSA9IGV4cG9ydHMuZ2V0TGFzdEludGVnZXJLZXkgPSBleHBvcnRzLmNoZWNrRm9yTGFzdE51bWVyaWNLZXkgPSB2b2lkIDA7XG4vKipcbiAqIENoZWNrIGZvciBsYXN0IG51bWVyaWMga2V5LlxuICovXG5mdW5jdGlvbiBjaGVja0Zvckxhc3ROdW1lcmljS2V5KG8pIHtcbiAgICBpZiAoIW8gfHwgdHlwZW9mIG8gIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG8pLmZpbHRlcihmdW5jdGlvbiAoZWxlbSkge1xuICAgICAgICByZXR1cm4gIWlzTmFOKHBhcnNlSW50KGVsZW0sIDEwKSk7XG4gICAgfSkuc3BsaWNlKC0xKVswXTtcbn1cbmV4cG9ydHMuY2hlY2tGb3JMYXN0TnVtZXJpY0tleSA9IGNoZWNrRm9yTGFzdE51bWVyaWNLZXk7XG4vKipcbiAqIEdldCBsYXN0IG51bWVyaWMga2V5IGZyb20gYW4gb2JqZWN0LlxuICogQHBhcmFtIG8gb2JqZWN0XG4gKiBAcmV0dXJuIGludFxuICovXG5mdW5jdGlvbiBnZXRMYXN0SW50ZWdlcktleShvKSB7XG4gICAgdmFyIGxhc3RLZXlJbmRleCA9IGNoZWNrRm9yTGFzdE51bWVyaWNLZXkobyk7XG4gICAgaWYgKHR5cGVvZiBsYXN0S2V5SW5kZXggPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUludChsYXN0S2V5SW5kZXgsIDEwKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn1cbmV4cG9ydHMuZ2V0TGFzdEludGVnZXJLZXkgPSBnZXRMYXN0SW50ZWdlcktleTtcbi8qKlxuICogR2V0IHRoZSBuZXh0IG51bWVyaWMga2V5IChsaWtlIHRoZSBpbmRleCBmcm9tIGEgUEhQIGFycmF5KVxuICogQHBhcmFtIG8gb2JqZWN0XG4gKiBAcmV0dXJuIGludFxuICovXG5mdW5jdGlvbiBnZXROZXh0SW50ZWdlcktleShvKSB7XG4gICAgdmFyIGxhc3RLZXlJbmRleCA9IGNoZWNrRm9yTGFzdE51bWVyaWNLZXkobyk7XG4gICAgaWYgKHR5cGVvZiBsYXN0S2V5SW5kZXggPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUludChsYXN0S2V5SW5kZXgsIDEwKSArIDE7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG59XG5leHBvcnRzLmdldE5leHRJbnRlZ2VyS2V5ID0gZ2V0TmV4dEludGVnZXJLZXk7XG4vKipcbiAqIEdldCB0aGUgcmVhbCBudW1iZXIgb2YgcHJvcGVydGllcyBmcm9tIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb1xuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gZ2V0T2JqTGVuZ3RoKG8pIHtcbiAgICBpZiAodHlwZW9mIG8gIT09ICdvYmplY3QnIHx8IG8gPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIHZhciBsID0gMDtcbiAgICB2YXIgaztcbiAgICBpZiAodHlwZW9mIE9iamVjdC5rZXlzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGwgPSBPYmplY3Qua2V5cyhvKS5sZW5ndGg7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmb3IgKGsgaW4gbykge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBrKSkge1xuICAgICAgICAgICAgICAgIGwrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbDtcbn1cbmV4cG9ydHMuZ2V0T2JqTGVuZ3RoID0gZ2V0T2JqTGVuZ3RoO1xuLyoqXG4gKiBTaW1wbGUgZXh0ZW5kIG9mIG93biBwcm9wZXJ0aWVzLlxuICogTmVlZGVkIGZvciBvdXIgc2V0dGluZ3MuXG4gKlxuICogQHBhcmFtIHtJRm9ybVRvT2JqZWN0T3B0aW9uc30gc2V0dGluZ3NcbiAqIEBwYXJhbSAge0lGb3JtVG9PYmplY3RPcHRpb25zfSBzb3VyY2UgVGhlIG9iamVjdCB3aXRoIG5ldyBwcm9wZXJ0aWVzIHRoYXQgd2Ugd2FudCB0byBhZGQgdGhlIGRlc3RpbmF0aW9uLlxuICogQHJldHVybiB7SUZvcm1Ub09iamVjdE9wdGlvbnN9XG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChzZXR0aW5ncywgc291cmNlKSB7XG4gICAgdmFyIGk7XG4gICAgZm9yIChpIGluIHNvdXJjZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwgaSkpIHtcbiAgICAgICAgICAgIHNldHRpbmdzW2ldID0gc291cmNlW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzZXR0aW5ncztcbn1cbmV4cG9ydHMuZXh0ZW5kID0gZXh0ZW5kO1xuLy8gSXRlcmF0aW9uIHRocm91Z2ggY29sbGVjdGlvbnMuIENvbXBhdGlibGUgd2l0aCBJRS5cbmZ1bmN0aW9uIGZvckVhY2goYXJyLCBjYWxsYmFjaykge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGFyciwgY2FsbGJhY2spO1xufVxuZXhwb3J0cy5mb3JFYWNoID0gZm9yRWFjaDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdGxvYWRlZDogZmFsc2UsXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuXHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIl9fd2VicGFja19yZXF1aXJlX18uYW1kRCA9IGZ1bmN0aW9uICgpIHtcblx0dGhyb3cgbmV3IEVycm9yKCdkZWZpbmUgY2Fubm90IGJlIHVzZWQgaW5kaXJlY3QnKTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5hbWRPID0ge307IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5ubWQgPSAobW9kdWxlKSA9PiB7XG5cdG1vZHVsZS5wYXRocyA9IFtdO1xuXHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdHJldHVybiBtb2R1bGU7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2V4cG9zZS10by1icm93c2VyLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9