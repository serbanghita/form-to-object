import { NodeValueResult } from "./types";
import { isChecked, isFileList, isUploadForm } from "./dom";
import { forEach } from "./utils";

/**
 * Context passed to element handlers containing form state and settings.
 */
export interface HandlerContext {
  $form: HTMLFormElement | null;
  includeEmptyValuedElements: boolean;
  includeSubmitButton: boolean;
}

/**
 * Get value from a radio input element.
 * Returns the value only if the radio is checked.
 */
export function getRadioValue(inputEl: HTMLInputElement): NodeValueResult {
  return isChecked(inputEl) ? inputEl.value : false;
}

/**
 * Get value from a checkbox input element.
 * Returns the value only if the checkbox is checked.
 */
export function getCheckboxValue(inputEl: HTMLInputElement): NodeValueResult {
  return isChecked(inputEl) ? inputEl.value : false;
}

/**
 * Get value from a file input element.
 * Returns FileList if available, otherwise the file path string.
 * Returns false if the form doesn't have proper encoding.
 */
export function getFileValue(
  inputEl: HTMLInputElement,
  $form: HTMLFormElement | null
): NodeValueResult {
  // Ignore input file fields if the form is not encoded properly.
  if ($form && isUploadForm($form)) {
    // HTML5 compatible browser.
    if (isFileList(inputEl) && inputEl.files?.length) {
      return inputEl.files;
    } else {
      return (inputEl.value && inputEl.value !== '') ? inputEl.value : false;
    }
  }
  return false;
}

/**
 * Get value from a textarea element.
 * Returns the value if non-empty, false otherwise.
 */
export function getTextareaValue(textareaEl: HTMLTextAreaElement): NodeValueResult {
  return (textareaEl.value && textareaEl.value !== '') ? textareaEl.value : false;
}

/**
 * Get value from a single select element.
 * Returns the selected value, or the first option value if nothing is explicitly selected.
 */
export function getSelectSimpleValue(selectEl: HTMLSelectElement): NodeValueResult {
  if (selectEl.value && selectEl.value !== '') {
    return selectEl.value;
  } else if (selectEl.options && selectEl.options.length && selectEl.options[0].value !== '') {
    return selectEl.options[0].value;
  }
  return false;
}

/**
 * Get values from a multiple select element.
 * Returns an array of selected option values.
 */
export function getSelectMultipleValue(
  selectEl: HTMLSelectElement,
  includeEmptyValuedElements: boolean
): NodeValueResult {
  if (selectEl.options && selectEl.options.length > 0) {
    const values: string[] = [];
    forEach(selectEl.options, function ($option: HTMLOptionElement) {
      if ($option.selected) {
        values.push($option.value);
      }
    });

    if (includeEmptyValuedElements) {
      return values;
    }
    return values.length ? values : false;
  }
  return false;
}

/**
 * Get value from a submit button element.
 * Returns the value or innerText if includeSubmitButton is true.
 */
export function getSubmitButtonValue(
  buttonEl: HTMLButtonElement,
  includeSubmitButton: boolean
): NodeValueResult {
  if (!includeSubmitButton) {
    return false;
  }
  if (buttonEl.value && buttonEl.value !== '') {
    return buttonEl.value;
  }
  if (buttonEl.innerText && buttonEl.innerText !== '') {
    return buttonEl.innerText;
  }
  return false;
}

/**
 * Get value from a generic input element (text, email, number, etc.).
 * This is the fallback handler for input types not specifically handled.
 */
export function getInputValue(
  inputEl: HTMLInputElement,
  includeEmptyValuedElements: boolean
): NodeValueResult {
  if (typeof inputEl.value !== 'undefined') {
    if (includeEmptyValuedElements) {
      return inputEl.value;
    }
    return inputEl.value !== '' ? inputEl.value : false;
  }
  return false;
}
