import {FormToObject} from "../../src/FormToObject";

describe('textarea', ()=> {
  it('should return an object', () => {
    const $form = document.createElement('form');
    $form.innerHTML = `
      <textarea name="textarea">textarea</textarea>
    `;
    const formToObject = new FormToObject($form);

    expect(formToObject.convertToObj()).toEqual({'textarea':'textarea'});
  });
  it('should return {} when the field has no value', () => {
    const $form = document.createElement('form');
    $form.innerHTML = `
      <textarea name="textarea"></textarea>
    `;
    const formToObject = new FormToObject($form);

    expect(formToObject.convertToObj()).toEqual({});
  });
  it('should return field name with empty value when the field has no value and includeEmptyValuedElements: true', () => {
    const $form = document.createElement('form');
    $form.innerHTML = `
      <textarea name="textarea"></textarea>
    `;
    const formToObject = new FormToObject($form, {includeEmptyValuedElements: true});

    expect(formToObject.convertToObj()).toEqual({'textarea': ''});
  });
});
