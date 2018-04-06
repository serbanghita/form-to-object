interface Window {
    FileList: FileList|null;
}

type HTMLFormField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement;

interface ISettings {
  [key: string]: boolean;
}

/**
 * Defaults
 */

let formRef: string | HTMLFormElement = null;

// Experimental. Don't rely on them yet.
let settings = {
    includeEmptyValuedElements: false,
    w3cSuccessfulControlsOnly: false
};

// Currently matching only '[]'.
const keyRegex = /[^\[\]]+|\[\]/g;
let $form: HTMLFormElement = null;
let $formElements: NodeListOf<HTMLFormField>;

/**
 * Private methods
 */

/**
 * Check to see if the object is a HTML node.
 *
 * @param {HTMLFormElement} node
 * @returns {boolean}
 */
function isDomElementNode(node: HTMLFormElement): boolean {
    return !!(node && typeof node === 'object' && 'nodeType' in node && node.nodeType === 1);
}

/**
 * Check for last numeric key.
 */
function checkForLastNumericKey(o: {}): string | undefined {
    if (!o || typeof o !== 'object') {
        return;
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
function getLastIntegerKey(o: {}) {
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
function getNextIntegerKey(o: {}) {
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
function getObjLength(o: {}) {

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
 * @param  {object} source The object with new properties that we want to add the the destination.
 * @return {object}
 */
function extend(settings: ISettings, source: ISettings) {
  let i: any;
  for (i in source) {
    if (source.hasOwnProperty(i)) {
      settings[i] = source[i];
    }
  }
  return settings;
}

// Iteration through collections.
// Compatible with IE.
function forEach(arr: HTMLCollection, callback: (params: any) => void) {
  if ([].forEach) {
    return [].forEach.call(arr, callback);
  }

  let i;
  for (i = 0; i < arr.length; i++) {
    callback.call(arr, arr[i], i);
  }

  return;
}

// Constructor
function init(options: string | [HTMLFormElement]) {
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
            $form = document.getElementById(formRef as string) as HTMLFormElement;
            break;

        case 'object':
            if (isDomElementNode(formRef as HTMLFormElement)) {
                $form = formRef as HTMLFormElement;
            }

            break;
    }

    return $form;
}

function isUploadForm(): boolean {
    return $form.enctype && $form.enctype === 'multipart/form-data';
}

// Set the elements we need to parse.
function setFormElements() {
    $formElements = $form.querySelectorAll('input, textarea, select');
    return $formElements.length;
}

function isRadio($domNode: HTMLInputElement) {
    return $domNode.nodeName === 'INPUT' && $domNode.type === 'radio';
}

function isCheckbox($domNode: HTMLInputElement) {
    return $domNode.nodeName === 'INPUT' && $domNode.type === 'checkbox';
}

function isFileField($domNode: HTMLInputElement) {
    return $domNode.nodeName === 'INPUT' && $domNode.type === 'file';
}

function isTextarea($domNode: HTMLTextAreaElement) {
    return $domNode.nodeName === 'TEXTAREA';
}

function isSelectSimple($domNode: HTMLSelectElement) {
    return $domNode.nodeName === 'SELECT' && $domNode.type === 'select-one';
}

function isSelectMultiple($domNode: HTMLSelectElement) {
    return $domNode.nodeName === 'SELECT' && $domNode.type === 'select-multiple';
}

function isSubmitButton($domNode: HTMLButtonElement) {
    return $domNode.nodeName === 'BUTTON' && $domNode.type === 'submit';
}

function isChecked($domNode: HTMLInputElement) {
    return $domNode.checked;
}

//function isMultiple($domNode){
//  return ($domNode.multiple ? true : false);
//}

function isFileList($domNode: HTMLInputElement) {
    return (window.FileList && ($domNode.files instanceof <any>window.FileList));
}

function getNodeValues($domNode: HTMLFormField) {
    // We're only interested in the radio that is checked.
    if (isRadio($domNode as HTMLInputElement)) {
        return isChecked($domNode as HTMLInputElement) ? ($domNode as HTMLInputElement).value : false;
    }

    // We're only interested in the checkbox that is checked.
    if (isCheckbox($domNode as HTMLInputElement)) {
        return isChecked($domNode as HTMLInputElement) ? ($domNode as HTMLInputElement).value : false;
    }

    // File inputs are a special case.
    // We have to grab the .files property of the input, which is a FileList.
    if (isFileField($domNode as HTMLInputElement)) {
        // Ignore input file fields if the form is not encoded properly.
        if (isUploadForm()) {
            // HTML5 compatible browser.
            if (isFileList($domNode as HTMLInputElement) && ($domNode as HTMLInputElement).files.length > 0) {
                return ($domNode as HTMLInputElement).files;
            } else {
                return (
                  ($domNode as HTMLInputElement).value && ($domNode as HTMLInputElement).value !== '' ?
                  ($domNode as HTMLInputElement).value :
                  false
                );
            }
        } else {
            return false;
        }
    }

    // We're only interested in textarea fields that have values.
    if (isTextarea($domNode as HTMLTextAreaElement)) {
        return (
          ($domNode as HTMLTextAreaElement).value && ($domNode as HTMLTextAreaElement).value !== '' ?
          ($domNode as HTMLTextAreaElement).value :
          false
        );
    }

    if (isSelectSimple($domNode as HTMLSelectElement)) {
        if (($domNode as HTMLSelectElement).value && ($domNode as HTMLSelectElement).value !== '') {
            return ($domNode as HTMLSelectElement).value;
        } else if (
          ($domNode as HTMLSelectElement).options &&
          ($domNode as HTMLSelectElement).options.length &&
          ($domNode as HTMLSelectElement).options[0].value !== ''
        ) {
            return ($domNode as HTMLSelectElement).options[0].value;
        } else {
            return false;
        }
    }

    // We're only interested in multiple selects that have at least one option selected.
    if (isSelectMultiple($domNode as HTMLSelectElement)) {
        if (($domNode as HTMLSelectElement).options && ($domNode as HTMLSelectElement).options.length > 0) {
          var values: any[] = [];
          forEach(($domNode as HTMLSelectElement).options, function ($option: HTMLOptionElement) {
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
    if (isSubmitButton($domNode as HTMLButtonElement)) {
        if (($domNode as HTMLButtonElement).value && ($domNode as HTMLButtonElement).value !== '') {
            return ($domNode as HTMLButtonElement).value;
        }

        if (($domNode as HTMLButtonElement).innerText && ($domNode as HTMLButtonElement).innerText !== '') {
            return ($domNode as HTMLButtonElement).innerText;
        }

        return false;
    }

    // Fallback or other non special fields.
    if (typeof ($domNode as HTMLButtonElement).value !== 'undefined') {
        if (settings.includeEmptyValuedElements) {
            return ($domNode as HTMLButtonElement).value;
        } else {
            return (($domNode as HTMLButtonElement).value !== '' ? ($domNode as HTMLButtonElement).value : false);
        }
    } else {
        return false;
    }
}

function processSingleLevelNode($domNode: HTMLFormField, arr: any[], domNodeValue: any, result: any) {
    // Get the last remaining key.
    var key = arr[0];

    // We're only interested in the radio that is checked.
    if (isRadio($domNode as HTMLInputElement)) {
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
    if (isCheckbox($domNode as HTMLInputElement)) {
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
    if (isSelectMultiple($domNode as HTMLSelectElement)) {
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

function processMultiLevelNode($domNode: HTMLFormField, arr: any[], value: any, result: any): any {
    let keyName = arr[0];

    if (arr.length > 1) {
        if (keyName === '[]') {
            //result.push({});
            result[getNextIntegerKey(result) as number] = {};
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
    var $domNode: HTMLFormField;
    var domNodeValue;
    var result = {};
    var resultLength;

    for (i = 0; i < $formElements.length; i++) {

        $domNode = $formElements[i];

        // Skip the element if the 'name' attribute is empty.
        // Skip the 'disabled' elements.
        // Skip the non selected radio elements.
        if (
            !$domNode.name ||
            $domNode.name === '' ||
            $domNode.disabled ||
            (isRadio($domNode as HTMLInputElement) && !isChecked($domNode as HTMLInputElement))
        ) {
            continue;
        }

        // Get the final processed domNode value.
        domNodeValue = getNodeValues($domNode as HTMLInputElement);

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
                objKeyNames,
                (domNodeValue ? domNodeValue : ''),
                result
            );
        }

        if (objKeyNames.length > 1) {
            processMultiLevelNode(
                $domNode,
                objKeyNames,
                (domNodeValue ? domNodeValue : ''),
                result
            );
        }

    }

    // Check the length of the result.
    resultLength = getObjLength(result);

    return resultLength > 0 ? result : false;
}
