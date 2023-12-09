import {screen} from '@testing-library/dom'
import formToObject from "../../src";
import {readIntegrationFixture} from "../helpers";

describe('exceptions', () => {
  describe('An invalid or non existing selector', () => {
    test('should return undefined if null is passed as argument', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(formToObject(null)).toBeUndefined();
    });

    test('should return undefined if an empty string is passed as argument', () => {
      expect(formToObject('')).toBeUndefined();
    });

    test('should return undefined if undefined object is passed', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(formToObject(undefined)).toBeUndefined();
    });

    test('should return undefined if the argument passed is invalid', () => {
      expect(formToObject('newFormUndefined')).toBeUndefined();
    });
  });

  describe('An empty HTML form', () => {
    test('should return undefined if the form has no elements', () => {
      document.body.innerHTML = readIntegrationFixture("other/exceptions/empty-form.html");
      const $form = screen.queryByTestId('testForm') as HTMLFormElement;

      expect(formToObject($form)).toBeUndefined();
    });
  });
});

