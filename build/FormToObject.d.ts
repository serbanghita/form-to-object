import { HTMLFormField, IFormToObjectOptions, NodeResult } from "./types";
export declare class FormToObject {
    static keyRegex: RegExp;
    formSelector: HTMLFormElement | string;
    $form: HTMLFormElement | null;
    $formElements: HTMLFormField[];
    settings: {
        includeEmptyValuedElements: boolean;
        w3cSuccessfulControlsOnly: boolean;
        debug: boolean;
    };
    constructor(selector: string | HTMLFormElement, options?: IFormToObjectOptions);
    /**
     * An HTML <form> can be initialized with a string DOM selector e.g. '.myForm'
     * or a DOM object reference.
     */
    initForm(): boolean;
    initFormElements(): boolean;
    convertToObj(): any;
    getNodeValues($domNode: HTMLFormField): string | false | FileList | string[] | null;
    processSingleLevelNode($domNode: HTMLFormField, arr: Array<string | number>, domNodeValue: string | number | boolean | FileList | string[], result: Record<string, string | number | boolean | FileList | string[] | unknown[]>): string | number | boolean | FileList | string[] | undefined;
    processMultiLevelNode($domNode: HTMLFormField, arr: Array<string | number>, value: string | number | boolean | FileList | string[], result: NodeResult): void;
    formElementHasSiblings($domNode: HTMLFormField): boolean;
}
