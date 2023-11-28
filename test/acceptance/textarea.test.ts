import formToObject from "../../src";
import {readFixture} from "../helpers";
import {screen} from "@testing-library/dom";

describe('textarea', ()=> {
  test('should return an object', () => {
    document.body.innerHTML = readFixture("textarea/textarea1.html");
    const $form = screen.queryByTestId('testForm') as HTMLFormElement;

    expect(formToObject($form)).toEqual({'address':'Place du Casino, 98000 Monaco'});
  });
});
