import { HTMLFormField } from "./types";
/**
 * Extract an array with all the DOM fields representing form fields.
 * Make sure we are backward compatible with older browsers.
 *
 * @param $form
 */
export declare function getAllFormElementsAsArray($form: HTMLFormElement): any[];
/**
 * Check to see if the object is an HTML node.
 *
 * @param {HTMLFormElement | HTMLElement} node
 * @returns {boolean}
 */
export declare function isDomElementNode(node: HTMLFormElement): boolean;
export declare function isUploadForm($form: HTMLFormElement): boolean;
export declare function isRadio($domNode: HTMLInputElement): boolean;
export declare function isCheckbox($domNode: HTMLFormField): boolean;
export declare function isFileField($domNode: HTMLInputElement): boolean;
export declare function isTextarea($domNode: HTMLTextAreaElement): boolean;
export declare function isSelectSimple($domNode: HTMLFormField): boolean;
export declare function isSelectMultiple($domNode: HTMLFormField): boolean;
export declare function isSubmitButton($domNode: HTMLButtonElement): boolean;
export declare function isChecked($domNode: HTMLInputElement): boolean;
export declare function isFileList($domNode: HTMLInputElement): boolean;
