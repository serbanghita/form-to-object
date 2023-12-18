import {FormToObject} from "../../src/FormToObject";

describe('constructor', () => {
  describe('An invalid or non existing selector', () => {
    it('null, should throw error', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        new FormToObject(null);
      }).toThrowError('No selector was passed.');
    });

    it('empty string, should throw error', () => {
      expect(() => {
        new FormToObject('');
      }).toThrowError('No selector was passed.');
    });

    it('undefined, should throw error', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        new FormToObject();
      }).toThrowError('No selector was passed.');
    });

    it('non-existent selector should throw error', () => {
      expect(() => {
        new FormToObject('non-existing-selector');
      }).toThrowError('The <form> DOM element could not be found.');
    });

    it('invalid DOM element ref should throw error', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        new FormToObject(document.createTextNode('text'));
      }).toThrowError('The <form> DOM element could not be found.');
    });

    it('invalid class should throw error', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        new FormToObject({nodeType: 1});
      }).toThrowError('The <form> is either not a valid DOM element or the browser is very old.');
    });

  });

  describe('An empty HTML form', () => {
    it('should return throw error', () => {
      expect(() => {
        const $form = document.createElement('form');
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        new FormToObject($form);
      }).toThrowError('No <form> DOM elements were found. Form is empty.');
    });
  });
});

