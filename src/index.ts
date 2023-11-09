import {FormToObject as FormToObjectClass} from "./FormToObject";
import {IFormToObjectOptions} from "./types";

export default function formToObject(selector: HTMLFormElement | string, options?: IFormToObjectOptions) {
  try {
    const instance = new FormToObjectClass(selector, options);
    return instance.convertToObj();
  } catch (e) {
    console.log('formToObject ERROR:', (e as Error).message);
    return false;
  }
}
