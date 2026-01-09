import {HTMLFormField} from "./types";

/**
 * Extract an array with all the DOM fields representing form fields.
 * Make sure we are backward compatible with older browsers.
 *
 * @param $form
 */
export function getAllFormElementsAsArray($form: HTMLFormElement): HTMLFormField[] {
  if ('querySelectorAll' in $form) {
    return [...($form?.querySelectorAll('input, textarea, select') as NodeListOf<HTMLFormField>)];
  } else if ('getElementsByTagName' in $form) {
    return [
      // @ts-expect-error for older browsers
      ...$form.getElementsByTagName('input'),
      // @ts-expect-error for older browsers
      ...$form.getElementsByTagName('textarea'),
      // @ts-expect-error for older browsers
      ...$form.getElementsByTagName('select')
    ];
  }

  throw new Error('The <form> is either not a valid DOM element or the browser is very old.');
}

/**
 * Check to see if the object is an HTML node.
 *
 * @param {HTMLFormElement | HTMLElement} node
 * @returns {boolean}
 */
export function isDomElementNode(node: HTMLElement | null): node is HTMLFormElement {
  return (node !== null && typeof node === 'object' && 'nodeType' in node && node.nodeType === 1);
}

export function isUploadForm($form: HTMLFormElement): boolean {
  return Boolean($form.enctype && $form.enctype === 'multipart/form-data');
}

/**
 * Check if element is a radio input.
 */
export function isRadio($domNode: HTMLFormField): boolean {
  return $domNode.nodeName === 'INPUT' && ($domNode as HTMLInputElement).type === 'radio';
}

/**
 * Check if element is a checkbox input.
 */
export function isCheckbox($domNode: HTMLFormField): boolean {
  return $domNode.nodeName === 'INPUT' && ($domNode as HTMLInputElement).type === 'checkbox';
}

/**
 * Check if element is a file input.
 */
export function isFileField($domNode: HTMLFormField): boolean {
  return $domNode.nodeName === 'INPUT' && ($domNode as HTMLInputElement).type === 'file';
}

/**
 * Check if element is a textarea.
 */
export function isTextarea($domNode: HTMLFormField): boolean {
  return $domNode.nodeName === 'TEXTAREA';
}

/**
 * Check if element is a single select.
 */
export function isSelectSimple($domNode: HTMLFormField): boolean {
  return $domNode.nodeName === 'SELECT' && $domNode.type === 'select-one';
}

/**
 * Check if element is a multiple select.
 */
export function isSelectMultiple($domNode: HTMLFormField): boolean {
  return $domNode.nodeName === 'SELECT' && $domNode.type === 'select-multiple';
}

/**
 * Check if element is a submit button.
 */
export function isSubmitButton($domNode: HTMLFormField): boolean {
  return ($domNode.nodeName === 'BUTTON' || $domNode.nodeName === 'INPUT') && $domNode.type === 'submit';
}

export function isChecked($domNode: HTMLInputElement): boolean {
  return $domNode.checked;
}

export function isFileList($domNode: HTMLInputElement): boolean {
  return (window.FileList && ($domNode.files instanceof window.FileList));
}
