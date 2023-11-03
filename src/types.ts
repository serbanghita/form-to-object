export interface Window {
  FileList: FileList|null;
  formToObject: IFormToObject;
}

type IFormToObject = (selector: HTMLFormElement | string, options?: IFormToObjectOptions) => Record<string, never>;

export type HTMLFormField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement;

export interface IFormToObjectOptions {
  [key: string]: boolean | string | number;
}

export interface IDefine {
  (arg: () => unknown): unknown;
  amd: unknown;
}

export interface IModule {
  exports: IFormToObject;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type NodeResult = Record<string | number, NodeResult | string | number>;
