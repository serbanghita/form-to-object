import {FormToObject} from "../../src/FormToObject";

describe('file input', () => {
  it('returns false when form does not have multipart encoding', () => {
    const $form = document.createElement('form');
    $form.innerHTML = '<input type="file" name="document">';

    const formToObject = new FormToObject($form);
    expect(formToObject.convertToObj()).toEqual({});
  });

  it('returns file value when form has multipart encoding', () => {
    const $form = document.createElement('form');
    $form.enctype = 'multipart/form-data';
    $form.innerHTML = '<input type="file" name="document">';

    const formToObject = new FormToObject($form);
    // File input without a file selected returns false (empty)
    expect(formToObject.convertToObj()).toEqual({});
  });

  it('handles file input with includeEmptyValuedElements', () => {
    const $form = document.createElement('form');
    $form.enctype = 'multipart/form-data';
    $form.innerHTML = '<input type="file" name="document">';

    const formToObject = new FormToObject($form, { includeEmptyValuedElements: true });
    // With includeEmptyValuedElements, even empty values are included
    expect(formToObject.convertToObj()).toEqual({ document: '' });
  });
});
