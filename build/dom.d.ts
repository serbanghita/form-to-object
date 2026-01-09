import { HTMLFormField } from "./types";
/**
 * Extract an array with all the DOM fields representing form fields.
 * Make sure we are backward compatible with older browsers.
 *
 * @param $form
 */
export declare function getAllFormElementsAsArray($form: HTMLFormElement): HTMLFormField[];
/**
 * Check to see if the object is an HTML node.
 *
 * @param {HTMLFormElement | HTMLElement} node
 * @returns {boolean}
 */
export declare function isDomElementNode(node: HTMLElement | null): node is HTMLFormElement;
export declare function isUploadForm($form: HTMLFormElement): boolean;
/**
 * Check if element is a radio input.
 */
export declare function isRadio($domNode: HTMLFormField): boolean;
/**
 * Check if element is a checkbox input.
 */
export declare function isCheckbox($domNode: HTMLFormField): boolean;
/**
 * Check if element is a file input.
 */
export declare function isFileField($domNode: HTMLFormField): boolean;
/**
 * Check if element is a textarea.
 */
export declare function isTextarea($domNode: HTMLFormField): boolean;
/**
 * Check if element is a single select.
 */
export declare function isSelectSimple($domNode: HTMLFormField): boolean;
/**
 * Check if element is a multiple select.
 */
export declare function isSelectMultiple($domNode: HTMLFormField): boolean;
/**
 * Check if element is a submit button.
 */
export declare function isSubmitButton($domNode: HTMLFormField): boolean;
export declare function isChecked($domNode: HTMLInputElement): boolean;
export declare function isFileList($domNode: HTMLInputElement): boolean;
