import {FormToObject} from "../../src/FormToObject";

describe('textarea', ()=> {
  it('should return an object', () => {
    const $form = document.createElement('form');
    $form.innerHTML = `
      <textarea name="address">address</textarea>
    `;
    const formToObject = new FormToObject($form);

    expect(formToObject.convertToObj()).toEqual({'address':'address'});
  });
});
