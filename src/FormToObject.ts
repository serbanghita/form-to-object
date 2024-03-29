import {HTMLFormField, IFormToObjectOptions, NodeResult} from "./types";
import {
  getAllFormElementsAsArray,
  isCheckbox,
  isChecked,
  isDomElementNode,
  isFileField,
  isFileList,
  isRadio, isSelectMultiple, isSelectSimple, isSubmitButton, isTextarea,
  isUploadForm
} from "./dom";
import {
  convertFieldNameToArrayOfKeys,
  extend,
  forEach,
  getLastIntegerKey,
  getNextIntegerKey,
  getObjLength
} from "./utils";



export class FormToObject {
  public formSelector: HTMLFormElement | string = '';
  public $form: HTMLFormElement | null = null;
  public $formElements: HTMLFormField[] = [];

  public settings: IFormToObjectOptions = {
    includeEmptyValuedElements: false,
    /**
     * It doesn't make sense to include submit buttons,
     * but if the use-case requires, we keep this option open.
     */
    includeSubmitButton: false,
    /**
     * By default, we don't include key:value pair from disabled fields.
     *
     */
    includeDisabledFields: false,
    w3cSuccessfulControlsOnly: false,
    /**
     * In case of a multiple select, e.g. <select name="multiple[]" multiple>
     * If true, we're going to mimic PHP POST payload behaviour,
     * then the <select>'s value will be:
     * ```
     * {
     *   "multiple": [111,222]
     * }
     * ```
     *
     * If false, then the <select>'s value will be:
     *
     * ```
     * {
     *    "multiple": [
     *      0: [111, 222]
     *    ]
     * }
     * ```
      */
    selectNameWithEmptyBracketsReturnsArray: true,
    checkBoxNameWithEmptyBracketsReturnsArray: true,
    debug: true
  };

  constructor(selector: string | HTMLFormElement, options?: IFormToObjectOptions) {
    // Assign the current form reference.
    if (!selector) {
      throw new Error('No selector was passed.')
    }

    // The form reference is always the first parameter of the method.
    // Eg: formToObject('myForm')
    this.formSelector = selector;

    // Override current settings.
    // Eg. formToObject('myForm', {mySetting: true})
    if (typeof options !== 'undefined' && getObjLength(options) > 0) {
      extend(this.settings, options);
    }

    if (!this.initForm()) {
      throw new Error('The <form> DOM element could not be found.')
    }

    if (!this.initFormElements()) {
      throw new Error('No <form> DOM elements were found. Form is empty.')
    }
  }

  /**
   * An HTML <form> can be initialized with a string DOM selector e.g. '.myForm'
   * or a DOM object reference.
   */
  public initForm(): boolean {
    if (typeof this.formSelector === 'string') {
      this.$form = document.getElementById(this.formSelector) as HTMLFormElement;
      return isDomElementNode(this.$form);
    } else if (isDomElementNode(this.formSelector)) {
      this.$form = this.formSelector as HTMLFormElement;
      return true;
    }

    return false;
  }

  // Set the elements we need to parse.
  public initFormElements(): boolean {
    // Note: https://caniuse.com/?search=querySelectorAll
    this.$formElements = getAllFormElementsAsArray(this.$form as HTMLFormElement);
    return this.$formElements.length > 0;
  }

  public convertToObj() {
    let i = 0;
    let objKeyNames;
    let $domNode: HTMLFormField;
    let domNodeValue;
    const result = Object.create(null);

    for (i = 0; i < this.$formElements.length; i++) {
      $domNode = this.$formElements[i];

      // Skip the element if the 'name' attribute is empty.
      // Skip the 'disabled' elements.
      // Skip the non-selected radio elements.
      if (
        !$domNode.name ||
        $domNode.name === '' ||
        ($domNode.disabled && !this.settings.includeDisabledFields) ||
        (isRadio($domNode as HTMLInputElement) && !isChecked($domNode as HTMLInputElement))
      ) {
        continue;
      }

      // Get the final processed domNode value.
      domNodeValue = this.getNodeValues($domNode as HTMLInputElement);

      // Exclude empty valued nodes if the settings allow it.
      if (domNodeValue === false && !this.settings.includeEmptyValuedElements) {
        continue;
      }

      // Extract all possible keys
      objKeyNames = convertFieldNameToArrayOfKeys($domNode.name);

      if (objKeyNames && objKeyNames.length === 1) {
        this.processSingleLevelNode($domNode, objKeyNames, (domNodeValue ? domNodeValue : ''), result);
      }

      if (objKeyNames && objKeyNames.length > 1) {
        if (isSelectMultiple($domNode) && this.settings.selectNameWithEmptyBracketsReturnsArray) {
          // Check for name in this format <select ---> name="multiple[]" <--- multiple />
          // Keep the name as "multiple" so it matches the PHP style POST payload format.
          if (objKeyNames.length === 2 && objKeyNames[1] === '[]') {
            objKeyNames = [objKeyNames[0]];
          }
        }

        // Check for name in this format <input type="checkbox" ---> name="checkbox[]" <--- />
        if (isCheckbox($domNode) && this.settings.checkBoxNameWithEmptyBracketsReturnsArray) {
          if (objKeyNames.length === 2 && objKeyNames[1] === '[]') {
            objKeyNames = [objKeyNames[0]];
          }
        }

        this.processMultiLevelNode($domNode, objKeyNames, (domNodeValue ? domNodeValue : ''), result);
      }

    }

    return result;
  }

  public getNodeValues($domNode: HTMLFormField) {
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
      if (isUploadForm(this.$form as HTMLFormElement)) {
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

        if (this.settings.includeEmptyValuedElements) {
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
      if (!this.settings.includeSubmitButton) {
        return false;
      }
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
      if (this.settings.includeEmptyValuedElements) {
        return ($domNode as HTMLButtonElement).value;
      } else {
        return (($domNode as HTMLButtonElement).value !== '' ? ($domNode as HTMLButtonElement).value : false);
      }
    } else {
      return false;
    }
  }

  public processSingleLevelNode(
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
        if (this.formElementHasSiblings($domNode)) {
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

  public processMultiLevelNode(
    $domNode: HTMLFormField,
    arr: Array<string | number>,
    value: string | number | boolean | FileList | string[],
    result: NodeResult
  ): void {
    const keyName = arr[0];

    if (arr.length > 1) {
      if (keyName === '[]') {
        //result.push({});
        result[getNextIntegerKey(result)] = Object.create(null);
        return this.processMultiLevelNode(
          $domNode,
          arr.splice(1, arr.length),
          value,
          result[getLastIntegerKey(result)]
        );
      } else {
        if (result[keyName] && getObjLength(result[keyName]) > 0) {
          //result[keyName].push(null);
          return this.processMultiLevelNode(
            $domNode,
            arr.splice(1, arr.length),
            value,
            result[keyName]
          );
        } else {
          if (isSelectMultiple($domNode) && arr.length >= 2 && arr[1] === '[]') {
            result[keyName] = [];
          } else {
            result[keyName] = Object.create(null);
          }
        }

        return this.processMultiLevelNode($domNode, arr.splice(1, arr.length), value, result[keyName]);
      }
    }

    // Last key, attach the original value.
    if (arr.length === 1) {
      if (keyName === '[]') {
        //result.push(value);
        result[getNextIntegerKey(result)] = value;
        return result;
      } else {
        this.processSingleLevelNode($domNode, arr, value, result);

        //  result[keyName] = value;
        return result;
      }
    }
  }

  public formElementHasSiblings($domNode: HTMLFormField) {
    const name = $domNode.name;
    return Array.prototype.filter.call(this.$formElements, (input: HTMLFormField) => { return input.name === name; }).length > 1;
  }
}














