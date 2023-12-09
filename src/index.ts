import {FormToObject as FormToObjectClass} from "./FormToObject";
import {IFormToObjectOptions} from "./types";

export default function formToObject<T>(selector: HTMLFormElement | string, options?: IFormToObjectOptions): T | undefined {
  try {
    const instance = new FormToObjectClass(selector, options);
    return instance.convertToObj() as T;
  } catch (e) {
    console.log('formToObject ERROR:', (e as Error).message);
  }
}
