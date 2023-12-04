import {screen} from '@testing-library/dom';
import formToObject from "../../src";
import {readIntegrationFixture} from "../helpers";

describe('checkbox', () => {
  test('A form with unchecked checkboxes searched by a valid element string should return false.', () => {
    document.body.innerHTML = readIntegrationFixture("checkbox/checkbox1.html");
    const $form = screen.queryByTestId('testForm') as HTMLFormElement;

    expect($form).not.toBeEmptyDOMElement();
    expect(formToObject($form)).toBe(false);
  });

  test('A form with a single checkbox without value attribute, should return the default value "on" as a string.', () => {
    document.body.innerHTML = readIntegrationFixture("checkbox/checkbox2.html");
    const $form = screen.queryByTestId('testForm') as HTMLFormElement;

    expect(formToObject($form)).toEqual({
      terms: "on"
    });
  });

  test('A form with two checkboxes with the same name and different values should return the checked element value as an array', () => {
    document.body.innerHTML = readIntegrationFixture("checkbox/checkbox3.html");
    const $form = screen.queryByTestId('testForm') as HTMLFormElement;

    expect(formToObject($form)).toEqual({
      subscribe: ["newsletter"]
    });
  });

  test('A form with various checkboxes should return the expected object.', () => {
    document.body.innerHTML = readIntegrationFixture("checkbox/checkbox4.html");
    const $form = screen.queryByTestId('testForm') as HTMLFormElement;

    expect(formToObject($form)).toEqual({
      'single': 'Serban',
      'many': {
        '0': 'First' // @todo: Should be ['First']. Known bug. Don't know yet if this is worth the effort.
      },
      'more': {
        'first': 'More First',
        'second': ['More Second First', 'More Second Second', 'More Second Third']
      },
      'singleSecond': 'Single second',
      'singleThird': ['Second option value']
    });
  });
});


