import {FormToObject} from "../../src/FormToObject";

describe('constructor', () => {
  describe('An invalid or non existing selector', () => {
    it('null, should throw error', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        new FormToObject(null);
      }).toThrow('No selector was passed.');
    });

    it('empty string, should throw error', () => {
      expect(() => {
        new FormToObject('');
      }).toThrow('No selector was passed.');
    });

    it('undefined, should throw error', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        new FormToObject();
      }).toThrow('No selector was passed.');
    });

    it('non-existent selector should throw error', () => {
      expect(() => {
        new FormToObject('non-existing-selector');
      }).toThrow('The <form> DOM element could not be found.');
    });

    it('invalid DOM element ref should throw error', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        new FormToObject(document.createTextNode('text'));
      }).toThrow('The <form> DOM element could not be found.');
    });

    it('invalid class should throw error', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        new FormToObject({nodeType: 1});
      }).toThrow('The <form> is either not a valid DOM element or the browser is very old.');
    });

    it('invalid CSS selector syntax should throw standard form not found error', () => {
      expect(() => {
        new FormToObject(':invalid[');
      }).toThrow('The <form> DOM element could not be found.');
    });

  });

  describe('An empty HTML form', () => {
    it('should return throw error', () => {
      expect(() => {
        const $form = document.createElement('form');
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        new FormToObject($form);
      }).toThrow('No <form> DOM elements were found. Form is empty.');
    });
  });

  describe('CSS selectors', () => {
    beforeEach(() => {
      // Clean up any existing forms
      document.body.innerHTML = '';
    });

    it('should find form by ID selector with #', () => {
      const $form = document.createElement('form');
      $form.id = 'testForm';
      $form.innerHTML = '<input type="text" name="field" value="test">';
      document.body.appendChild($form);

      const formToObject = new FormToObject('#testForm');
      expect(formToObject.convertToObj()).toEqual({ field: 'test' });
    });

    it('should find form by class selector', () => {
      const $form = document.createElement('form');
      $form.className = 'my-form';
      $form.innerHTML = '<input type="text" name="field" value="test">';
      document.body.appendChild($form);

      const formToObject = new FormToObject('.my-form');
      expect(formToObject.convertToObj()).toEqual({ field: 'test' });
    });

    it('should find form by attribute selector', () => {
      const $form = document.createElement('form');
      $form.setAttribute('data-form', 'test');
      $form.innerHTML = '<input type="text" name="field" value="test">';
      document.body.appendChild($form);

      const formToObject = new FormToObject('form[data-form="test"]');
      expect(formToObject.convertToObj()).toEqual({ field: 'test' });
    });

    it('should find form by plain ID (backward compatibility)', () => {
      const $form = document.createElement('form');
      $form.id = 'myForm';
      $form.innerHTML = '<input type="text" name="field" value="test">';
      document.body.appendChild($form);

      const formToObject = new FormToObject('myForm');
      expect(formToObject.convertToObj()).toEqual({ field: 'test' });
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });
  });
});

