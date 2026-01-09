import { vi } from 'vitest';
import formToObject from "../../src/index";

describe('formToObject (index)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('returns object for valid form', () => {
    const $form = document.createElement('form');
    $form.id = 'testForm';
    $form.innerHTML = '<input type="text" name="field" value="test">';
    document.body.appendChild($form);

    const result = formToObject('testForm');
    expect(result).toEqual({ field: 'test' });
  });

  it('returns undefined and logs error for invalid selector', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const result = formToObject('non-existent-form');

    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(
      'formToObject ERROR:',
      'The <form> DOM element could not be found.'
    );

    consoleSpy.mockRestore();
  });

  it('returns undefined and logs error for empty form', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const $form = document.createElement('form');
    $form.id = 'emptyForm';
    document.body.appendChild($form);

    const result = formToObject('emptyForm');

    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(
      'formToObject ERROR:',
      'No <form> DOM elements were found. Form is empty.'
    );

    consoleSpy.mockRestore();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });
});
