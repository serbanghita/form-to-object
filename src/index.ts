import {FormToObject as FormToObjectClass} from "./FormToObject";
import {IFormToObjectOptions} from "./types";

export default function formToObject(selector: HTMLFormElement | string, options?: IFormToObjectOptions) {
  const instance = new FormToObjectClass(selector, options);
  return instance.convertToObj();
}
