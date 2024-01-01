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
export type NodeResult = Record<string | number, NodeResult | string | number>;
export {};
