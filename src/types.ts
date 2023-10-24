export interface Window {
  FileList: FileList|null;
  formToObject: IFormToObject;
}

export type HTMLFormField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement;

export interface ISettings {
  [key: string]: boolean | string | number;
}

export type IFormToObjectArgs = string | [string, HTMLFormElement] | undefined;

export interface IFormToObject {
  (options?: IFormToObjectArgs): Record<string, unknown>;
}

export interface IDefine {
  (arg: () => unknown): unknown;
  amd: unknown;
}

export interface IModule {
  exports: IFormToObject;
}
