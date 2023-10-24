import {extend, forEach, getLastIntegerKey, getNextIntegerKey, getObjLength, isDomElementNode} from "./functions";
import {HTMLFormField} from "./types";

/**
 * Defaults
 */

let formRef: string | HTMLFormElement;

// Experimental. Don't rely on them yet.
const settings = {
    includeEmptyValuedElements: false,
    w3cSuccessfulControlsOnly: false
};

// Currently matching only fields like 'fieldName[...] or fieldName[]'.
const keyRegex = /[^[\]]+|\[]/g;
let $form: HTMLFormElement;
let $formElements: NodeListOf<HTMLFormField>;

// Constructor
export function init(options?: string | [string, HTMLFormElement] | undefined) {
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
    return Boolean($form.enctype && $form.enctype === 'multipart/form-data');
}

// Set the elements we need to parse.
function setFormElements() {
    $formElements = $form.querySelectorAll('input, textarea, select');
    return $formElements.length;
}

function nodeHasSiblings($domNode: HTMLFormField) {
  const name = $domNode.name;
  return Array.prototype.filter.call($formElements, (input: HTMLFormField) => { return input.name === name; }).length > 1;
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
    return (window.FileList && ($domNode.files instanceof window.FileList));
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
            if (isFileList($domNode as HTMLInputElement) && ($domNode as HTMLInputElement)?.files?.length) {
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
          const values: string[] = [];
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

    // Fallback or other non-special fields.
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

function processSingleLevelNode(
  $domNode: HTMLFormField,
  arr: Array<string | number>,
  domNodeValue: string | number | boolean | FileList | string[],
  result: Record<string, string | number | boolean | FileList | string[] | unknown[]>
) {
    // Get the last remaining key.
    const key = arr[0];

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
          if (nodeHasSiblings($domNode)) {
            if (!result[key]) {
              result[key] = [];
            }

            return (result[key] as Array<string | number | boolean | FileList | string[]>).push(domNodeValue);
          } else {
            result[key] = domNodeValue;
          }
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


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
type NodeResult = Record<string | number, NodeResult | string | number>;

// interface NodeResult extends Record<string, NodeResult> {}

function processMultiLevelNode(
  $domNode: HTMLFormField,
  arr: Array<string | number>,
  value: string | number | boolean | FileList | string[],
  result: NodeResult
) {
    const keyName = arr[0];

    if (arr.length > 1) {
        if (keyName === '[]') {
            //result.push({});
            result[getNextIntegerKey(result)] = Object.create(null);
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
                result[keyName] = Object.create(null);
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
  let i = 0;
  let objKeyNames;
  let $domNode: HTMLFormField;
  let domNodeValue;
  const result = {};

  for (i = 0; i < $formElements.length; i++) {

      $domNode = $formElements[i];

      // Skip the element if the 'name' attribute is empty.
      // Skip the 'disabled' elements.
      // Skip the non-selected radio elements.
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
      // E.g. name="firstName", name="settings[a][b]", name="settings[0][a]"
      objKeyNames = $domNode.name.match(keyRegex);

      if (objKeyNames && objKeyNames.length === 1) {
          processSingleLevelNode(
              $domNode,
              objKeyNames,
              (domNodeValue ? domNodeValue : ''),
              result
          );
      }

      if (objKeyNames && objKeyNames.length > 1) {
          processMultiLevelNode(
              $domNode,
              objKeyNames,
              (domNodeValue ? domNodeValue : ''),
              result
          );
      }

    }

    // Check the length of the result.
    const resultLength = getObjLength(result);

    return resultLength > 0 ? result : false;
}
