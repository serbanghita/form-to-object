import { HTMLFormField, IFormToObjectOptions, NodeResult } from "./types";
export declare class FormToObject {
    static keyRegex: RegExp;
    formSelector: HTMLFormElement | string;
    $form: HTMLFormElement | null;
    $formElements: HTMLFormField[];
    settings: {
        includeEmptyValuedElements: boolean;
        w3cSuccessfulControlsOnly: boolean;
        /**
         * In case of a multiple select, e.g. <select name="multiple[]" multiple>
         * If true, we're going to mimic PHP POST payload behaviour,
         * then the <select>'s value will be:
         * ```
         * {
         *   "multiple": [111,222]
         * }
         * ```
         *
         * If false, then the <select>'s value will be:
         *
         * ```
         * {
         *    "multiple": [
         *      0: [111, 222]
         *    ]
         * }
         * ```
          */
        phpStyleMultipleSelects: boolean;
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
    getNodeValues($domNode: HTMLFormField): string | false | string[] | FileList | null;
    processSingleLevelNode($domNode: HTMLFormField, arr: Array<string | number>, domNodeValue: string | number | boolean | FileList | string[], result: Record<string, string | number | boolean | FileList | string[] | unknown[]>): string | number | boolean | string[] | FileList | undefined;
    processMultiLevelNode($domNode: HTMLFormField, arr: Array<string | number>, value: string | number | boolean | FileList | string[], result: NodeResult): void;
    formElementHasSiblings($domNode: HTMLFormField): boolean;
}
