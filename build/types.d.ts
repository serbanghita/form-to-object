export interface Window {
    FileList: FileList | null;
    formToObject: IFormToObject;
}
type IFormToObject = (selector: HTMLFormElement | string, options?: IFormToObjectOptions) => Record<string, never>;
export type HTMLFormField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement;
export interface IFormToObjectOptions {
    includeEmptyValuedElements?: boolean;
    includeSubmitButton?: boolean;
    includeDisabledFields?: boolean;
    w3cSuccessfulControlsOnly?: boolean;
    selectNameWithEmptyBracketsReturnsArray?: boolean;
    checkBoxNameWithEmptyBracketsReturnsArray?: boolean;
    debug?: boolean;
    [key: string]: boolean | undefined;
}
export interface IDefine {
    (arg: () => unknown): unknown;
    amd: unknown;
}
export interface IModule {
    exports: IFormToObject;
}
/**
 * Represents a single form field value.
 * Can be a string, FileList (for file inputs), or an array of strings (for multi-select/checkboxes).
 */
export type FormFieldValue = string | FileList | string[];
/**
 * Represents a form value that can be nested.
 * Used for multi-level field names like "settings[video][resolution]".
 */
export type FormValue = FormFieldValue | FormValueObject | FormValueArray;
export interface FormValueObject {
    [key: string]: FormValue;
}
export type FormValueArray = FormValue[];
/**
 * Represents the result of converting a form to an object.
 * Supports arbitrary nesting for complex form structures.
 */
export type NodeResult = {
    [key: string | number]: FormValue | NodeResult;
};
/**
 * The value returned from getNodeValues - either a valid value or false if empty/invalid.
 */
export type NodeValueResult = string | string[] | FileList | false;
export {};
