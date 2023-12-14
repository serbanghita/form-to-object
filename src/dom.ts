import {HTMLFormField} from "./types";

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

export function isCheckbox($domNode: HTMLInputElement) {
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
  return $domNode.nodeName === 'BUTTON' && $domNode.type === 'submit';
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

