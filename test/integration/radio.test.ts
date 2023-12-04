import {screen} from '@testing-library/dom'
import formToObject from "../../src";
import {readFixture} from "../helpers";

describe('radio', () => {
  describe('A form with unchecked radios', () => {
    test('searched by a valid element string should return false', () => {
      document.body.innerHTML = readFixture("radio/radio1.html");
      const $form = screen.queryByTestId('testForm') as HTMLFormElement;

      expect(formToObject($form)).toBe(false);
    });
  });

  describe('A form with various radio elements checked', () => {
    it('searched by a valid element string should return an object with checked elements', () =>{
      document.body.innerHTML = readFixture("radio/radio2.html");
      const $form = screen.queryByTestId('testForm') as HTMLFormElement;

      expect(formToObject($form)).toEqual({
        'first': 'First value from first',
        'second': 'First value from second',
        'third': 'Second value',
        'fourth': '0'
      });
    });

  });
});
