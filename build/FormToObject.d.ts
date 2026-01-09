import { HTMLFormField, IFormToObjectOptions, NodeResult, NodeValueResult, FormFieldValue } from "./types";
export declare class FormToObject {
    formSelector: HTMLFormElement | string;
    $form: HTMLFormElement | null;
    $formElements: HTMLFormField[];
    settings: IFormToObjectOptions;
    constructor(selector: string | HTMLFormElement, options?: IFormToObjectOptions);
    /**
     * An HTML <form> can be initialized with a CSS selector string (e.g. '#myForm', '.myForm',
     * 'form[data-id="test"]') or a DOM object reference.
     *
     * For backward compatibility, plain strings without CSS selector characters
     * are treated as element IDs (e.g. 'myForm' becomes '#myForm').
     */
    initForm(): boolean;
    initFormElements(): boolean;
    convertToObj(): NodeResult;
    /**
     * Extract the value from a form field element.
     * Delegates to specialized handlers based on element type.
     */
    getNodeValues($domNode: HTMLFormField): NodeValueResult;
    processSingleLevelNode($domNode: HTMLFormField, arr: string[], domNodeValue: FormFieldValue, result: NodeResult): FormFieldValue | number | void;
    processMultiLevelNode($domNode: HTMLFormField, arr: string[], value: FormFieldValue, result: NodeResult): NodeResult | void;
    formElementHasSiblings($domNode: HTMLFormField): boolean;
}
