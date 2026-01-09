import { NodeValueResult } from "./types";
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
export declare function getRadioValue(inputEl: HTMLInputElement): NodeValueResult;
/**
 * Get value from a checkbox input element.
 * Returns the value only if the checkbox is checked.
 */
export declare function getCheckboxValue(inputEl: HTMLInputElement): NodeValueResult;
/**
 * Get value from a file input element.
 * Returns FileList if available, otherwise the file path string.
 * Returns false if the form doesn't have proper encoding.
 */
export declare function getFileValue(inputEl: HTMLInputElement, $form: HTMLFormElement | null): NodeValueResult;
/**
 * Get value from a textarea element.
 * Returns the value if non-empty, false otherwise.
 */
export declare function getTextareaValue(textareaEl: HTMLTextAreaElement): NodeValueResult;
/**
 * Get value from a single select element.
 * Returns the selected value, or the first option value if nothing is explicitly selected.
 */
export declare function getSelectSimpleValue(selectEl: HTMLSelectElement): NodeValueResult;
/**
 * Get values from a multiple select element.
 * Returns an array of selected option values.
 */
export declare function getSelectMultipleValue(selectEl: HTMLSelectElement, includeEmptyValuedElements: boolean): NodeValueResult;
/**
 * Get value from a submit button element.
 * Returns the value or innerText if includeSubmitButton is true.
 */
export declare function getSubmitButtonValue(buttonEl: HTMLButtonElement, includeSubmitButton: boolean): NodeValueResult;
/**
 * Get value from a generic input element (text, email, number, etc.).
 * This is the fallback handler for input types not specifically handled.
 */
export declare function getInputValue(inputEl: HTMLInputElement, includeEmptyValuedElements: boolean): NodeValueResult;
