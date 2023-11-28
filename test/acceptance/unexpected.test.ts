import formToObject from "../../src";
import {readFixture} from "../helpers";
import {screen} from "@testing-library/dom";

/**
 * Unexpected situations tests.
 */

describe('unexpected', () => {

  test('A form with two duplicate elements should return only one key with the last value', () => {
    document.body.innerHTML = readFixture("other/unexpected/unexpected1.html");
    const $form = screen.queryByTestId('testForm') as HTMLFormElement;

    expect(formToObject($form)).toEqual({ firstName:'Ghita' });
  });

  test('A form with one input element without name attribute should return an empty object', function() {
    document.body.innerHTML = readFixture("other/unexpected/unexpected2.html");
    const $form = screen.queryByTestId('testForm') as HTMLFormElement;

    expect(formToObject($form)).toBe(false);
  });

  test('A form that contains one field without name attribute should return the non empty valid keys and values', function() {
    document.body.innerHTML = readFixture("other/unexpected/unexpected3.html");
    const $form = screen.queryByTestId('testForm') as HTMLFormElement;

    expect(formToObject($form)).toEqual({ name:'Serban' });
  });

});
