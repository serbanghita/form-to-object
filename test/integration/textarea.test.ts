import formToObject from "../../src";
import {readIntegrationFixture} from "../helpers";
import {screen} from "@testing-library/dom";

describe('textarea', ()=> {
  test('should return an object', () => {
    document.body.innerHTML = readIntegrationFixture("textarea/textarea1.html");
    const $form = screen.queryByTestId('testForm') as HTMLFormElement;

    expect(formToObject($form)).toEqual({'address':'Place du Casino, 98000 Monaco'});
  });
});
