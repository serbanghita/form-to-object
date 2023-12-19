import {HTMLFormField} from "./types";

/**
 * Extract an array with all the DOM fields representing form fields.
 * Make sure we are backward compatible with older browsers.
 *
 * @param $form
 */
export function getAllFormElementsAsArray($form: HTMLFormElement) {
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
export function isDomElementNode(node: HTMLFormElement): boolean {
  return (Boolean(node) && typeof node === 'object' && 'nodeType' in node && node.nodeType === 1);
}

export function isUploadForm($form: HTMLFormElement): boolean {
  return Boolean($form.enctype && $form.enctype === 'multipart/form-data');
}

export function isRadio($domNode: HTMLInputElement) {
  return $domNode.nodeName === 'INPUT' && $domNode.type === 'radio';
}

export function isCheckbox($domNode: HTMLFormField) {
  return $domNode.nodeName === 'INPUT' && $domNode.type === 'checkbox';
}

export function isFileField($domNode: HTMLInputElement) {
  return $domNode.nodeName === 'INPUT' && $domNode.type === 'file';
}

export function isTextarea($domNode: HTMLTextAreaElement) {
  return $domNode.nodeName === 'TEXTAREA';
}

export function isSelectSimple($domNode: HTMLFormField) {
  return $domNode.nodeName === 'SELECT' && $domNode.type === 'select-one';
}

export function isSelectMultiple($domNode: HTMLFormField) {
  return $domNode.nodeName === 'SELECT' && $domNode.type === 'select-multiple';
}

export function isSubmitButton($domNode: HTMLButtonElement) {
  return ($domNode.nodeName === 'BUTTON' || $domNode.nodeName === 'INPUT') && $domNode.type === 'submit';
}

export function isChecked($domNode: HTMLInputElement) {
  return $domNode.checked;
}

//function isMultiple($domNode){
//  return ($domNode.multiple ? true : false);
//}

export function isFileList($domNode: HTMLInputElement) {
  return (window.FileList && ($domNode.files instanceof window.FileList));
}

