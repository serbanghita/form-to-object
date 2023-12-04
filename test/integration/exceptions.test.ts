import {screen} from '@testing-library/dom'
import formToObject from "../../src";
import {readIntegrationFixture} from "../helpers";

describe('exceptions', () => {
  describe('An invalid or non existing selector', () => {
    test('should return false if null is passed as argument', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(formToObject(null)).toBe(false);
    });

    test('should return false if an empty string is passed as argument', () => {
      expect(formToObject('')).toBe(false);
    });

    test('should return false if undefined object is passed', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(formToObject(undefined)).toBe(false);
    });

    test('should return false if the argument passed is invalid', () => {
      expect(formToObject('newFormUndefined')).toBe(false);
    });
  });

  describe('An empty HTML form', () => {
    test('should return false if the form has no elements', () => {
      document.body.innerHTML = readIntegrationFixture("other/exceptions/empty-form.html");
      const $form = screen.queryByTestId('testForm') as HTMLFormElement;

      expect(formToObject($form)).toBe(false);
    });
  });
});

