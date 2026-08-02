import {HTMLFormField, IFormToObjectOptions, NodeResult, NodeValueResult, FormFieldValue} from "./types";
import {
  getAllFormElementsAsArray,
  isCheckbox,
  isChecked,
  isDomElementNode,
  isFileField,
  isRadio,
  isSelectMultiple,
  isSelectSimple,
  isSubmitButton,
  isTextarea
} from "./dom";
import {
  convertFieldNameToArrayOfKeys,
  extend,
  isDangerousKey,
  getLastIntegerKey,
  getNextIntegerKey,
  getObjLength
} from "./utils";
import {
  getRadioValue,
  getCheckboxValue,
  getFileValue,
  getTextareaValue,
  getSelectSimpleValue,
  getSelectMultipleValue,
  getSubmitButtonValue,
  getInputValue
} from "./handlers";

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
   * An HTML <form> can be initialized with a CSS selector string (e.g. '#myForm', '.myForm',
   * 'form[data-id="test"]') or a DOM object reference.
   *
   * For backward compatibility, plain strings without CSS selector characters
   * are treated as element IDs (e.g. 'myForm' becomes '#myForm').
   */
  public initForm(): boolean {
    if (typeof this.formSelector === 'string') {
      // If the selector contains CSS selector characters, use it as-is.
      // Otherwise, treat it as an ID for backward compatibility.
      const selector = /[.#[\] >+~:*]/.test(this.formSelector)
        ? this.formSelector
        : `#${this.formSelector}`;
      const element = document.querySelector(selector);
      if (isDomElementNode(element as HTMLElement | null)) {
        this.$form = element as HTMLFormElement;
        return true;
      }
      return false;
    }

    if (isDomElementNode(this.formSelector as HTMLElement | null)) {
      this.$form = this.formSelector as HTMLFormElement;
      return true;
    }

    return false;
  }

  // Set the elements we need to parse.
  public initFormElements(): boolean {
    if (!this.$form) {
      return false;
    }
    this.$formElements = getAllFormElementsAsArray(this.$form);
    return this.$formElements.length > 0;
  }

  public convertToObj(): NodeResult {
    const result: NodeResult = Object.create(null);

    for (let i = 0; i < this.$formElements.length; i++) {
      const $domNode = this.$formElements[i];

      // Skip the element if the 'name' attribute is empty.
      // Skip the 'disabled' elements.
      // Skip the non-selected radio elements.
      if (
        !$domNode.name ||
        $domNode.name === '' ||
        ($domNode.disabled && !this.settings.includeDisabledFields) ||
        (isRadio($domNode) && !isChecked($domNode as HTMLInputElement))
      ) {
        continue;
      }

      // Get the final processed domNode value.
      const domNodeValue = this.getNodeValues($domNode);

      // Exclude empty valued nodes if the settings allow it.
      if (domNodeValue === false && !this.settings.includeEmptyValuedElements) {
        continue;
      }

      // Extract all possible keys
      let objKeyNames = convertFieldNameToArrayOfKeys($domNode.name);

      if (objKeyNames && objKeyNames.length === 1) {
        this.processSingleLevelNode($domNode, objKeyNames, (domNodeValue !== false ? domNodeValue : ''), result);
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

        this.processMultiLevelNode($domNode, objKeyNames, (domNodeValue !== false ? domNodeValue : ''), result);
      }
    }

    return result;
  }

  /**
   * Extract the value from a form field element.
   * Delegates to specialized handlers based on element type.
   */
  public getNodeValues($domNode: HTMLFormField): NodeValueResult {
    if (isRadio($domNode)) {
      return getRadioValue($domNode as HTMLInputElement);
    }

    if (isCheckbox($domNode)) {
      return getCheckboxValue($domNode as HTMLInputElement);
    }

    if (isFileField($domNode)) {
      return getFileValue($domNode as HTMLInputElement, this.$form);
    }

    if (isTextarea($domNode)) {
      return getTextareaValue($domNode as HTMLTextAreaElement);
    }

    if (isSelectSimple($domNode)) {
      return getSelectSimpleValue($domNode as HTMLSelectElement);
    }

    if (isSelectMultiple($domNode)) {
      return getSelectMultipleValue(
        $domNode as HTMLSelectElement,
        this.settings.includeEmptyValuedElements ?? false
      );
    }

    if (isSubmitButton($domNode)) {
      return getSubmitButtonValue(
        $domNode as HTMLButtonElement,
        this.settings.includeSubmitButton ?? false
      );
    }

    // Fallback for generic input types (text, email, number, etc.)
    return getInputValue(
      $domNode as HTMLInputElement,
      this.settings.includeEmptyValuedElements ?? false
    );
  }

  public processSingleLevelNode(
    $domNode: HTMLFormField,
    arr: string[],
    domNodeValue: FormFieldValue,
    result: NodeResult
  ): FormFieldValue | number | void {
    // Get the last remaining key.
    const key = arr[0];
    if (isDangerousKey(key)) {
      return;
    }

    // We're only interested in the radio that is checked.
    if (isRadio($domNode)) {
      if (domNodeValue !== '') {
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
      if (domNodeValue !== '') {
        if (this.formElementHasSiblings($domNode)) {
          if (!result[key]) {
            result[key] = [];
          }
          return (result[key] as FormFieldValue[]).push(domNodeValue);
        } else {
          result[key] = domNodeValue;
        }
      } else {
        return;
      }
    }

    // Multiple select is a special case.
    // We have to grab each selected option and put them into an array.
    if (isSelectMultiple($domNode)) {
      if (domNodeValue !== '') {
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
    arr: string[],
    value: FormFieldValue,
    result: NodeResult
  ): NodeResult | void {
    const keyName = arr[0];
    if (isDangerousKey(keyName)) {
      return;
    }

    if (arr.length > 1) {
      if (keyName === '[]') {
        result[getNextIntegerKey(result)] = Object.create(null);
        return this.processMultiLevelNode(
          $domNode,
          arr.slice(1),
          value,
          result[getLastIntegerKey(result)] as NodeResult
        );
      } else {
        if (result[keyName] && getObjLength(result[keyName] as object) > 0) {
          return this.processMultiLevelNode(
            $domNode,
            arr.slice(1),
            value,
            result[keyName] as NodeResult
          );
        } else {
          if (isSelectMultiple($domNode) && arr.length >= 2 && arr[1] === '[]') {
            result[keyName] = [];
          } else {
            result[keyName] = Object.create(null);
          }
        }

        return this.processMultiLevelNode($domNode, arr.slice(1), value, result[keyName] as NodeResult);
      }
    }

    // Last key, attach the original value.
    if (arr.length === 1) {
      if (keyName === '[]') {
        result[getNextIntegerKey(result)] = value;
        return result;
      } else {
        this.processSingleLevelNode($domNode, arr, value, result);
        return result;
      }
    }
  }

  public formElementHasSiblings($domNode: HTMLFormField): boolean {
    const name = $domNode.name;
    return Array.prototype.filter.call(this.$formElements, (input: HTMLFormField) => input.name === name).length > 1;
  }
}
