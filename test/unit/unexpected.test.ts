import {FormToObject} from "../../src/FormToObject";

/**
 * Unexpected situations tests.
 */

describe('unexpected', () => {

  it('two duplicate elements should return only one key with the last value', () => {
    const $form = document.createElement('form');
    $form.innerHTML = `
      <input type="text" name="text" value="first">
      <input type="text" name="text" value="second">
    `;

    const formToObject = new FormToObject($form);

    expect(formToObject.convertToObj()).toEqual({ text:'second' });
  });

  it('one input element without name attribute should return {}', function() {
    const $form = document.createElement('form');
    $form.innerHTML = `
        <input type="text" value="4111111111111111">
    `;

    const formToObject = new FormToObject($form);

    expect(formToObject.convertToObj()).toEqual({});
  });

  it('one field without "type" attribute should return key and value', function() {
    const $form = document.createElement('form');
    $form.innerHTML = `
      <input name="text" value="text">
    `;
    const formToObject = new FormToObject($form);

    expect(formToObject.convertToObj()).toEqual({ text:'text' });
  });

  it('one field with "disabled" attribute should return {}', function() {
    const $form = document.createElement('form');
    $form.innerHTML = `
      <input name="text" value="text" disabled>
    `;
    const formToObject = new FormToObject($form);

    expect(formToObject.convertToObj()).toEqual({});
  });

  it('one field with "disabled" attribute, with includeDisabledFields: true, should return key:value pair', function() {
    const $form = document.createElement('form');
    $form.innerHTML = `
      <input name="text" value="text" disabled>
    `;
    const formToObject = new FormToObject($form, {includeDisabledFields: true});

    expect(formToObject.convertToObj()).toEqual({'text': 'text'});
  });

  it('one field with no value should return {}', function() {
    const $form = document.createElement('form');
    $form.innerHTML = `
      <input name="text">
    `;
    const formToObject = new FormToObject($form);

    expect(formToObject.convertToObj()).toEqual({});
  });

  it('one field with no value, with includeEmptyValuedElements: true, should return key:value', function() {
    const $form = document.createElement('form');
    $form.innerHTML = `
      <input name="text">
    `;
    const formToObject = new FormToObject($form, {includeEmptyValuedElements: true});

    expect(formToObject.convertToObj()).toEqual({'text': ''});
  });

  it('input with name "__proto__" should not create __proto__ key or pollute prototype', () => {
    const $form = document.createElement('form');
    $form.innerHTML = `
      <input name="__proto__" value="polluted">
    `;
    const formToObject = new FormToObject($form);
    const obj = formToObject.convertToObj();
    expect(obj).toEqual({});
    expect(Object.prototype.hasOwnProperty.call(obj, '__proto__')).toBe(false);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it('input with name "__proto__.polluted" should not create __proto__ key or pollute prototype', () => {
    const $form = document.createElement('form');
    $form.innerHTML = `
      <input name="__proto__.polluted" value="yes">
    `;
    const formToObject = new FormToObject($form);
    const obj = formToObject.convertToObj();
    expect(obj).toEqual({});
    expect(Object.prototype.hasOwnProperty.call(obj, '__proto__')).toBe(false);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it('input with name "constructor.prototype.polluted" should not create constructor key or pollute prototype', () => {
    const $form = document.createElement('form');
    $form.innerHTML = `
      <input name="constructor.prototype.polluted" value="yes">
    `;
    const formToObject = new FormToObject($form);
    const obj = formToObject.convertToObj();
    expect(obj).toEqual({});
    expect(Object.prototype.hasOwnProperty.call(obj, 'constructor')).toBe(false);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it('input with name "user[__proto__][polluted]" should not create __proto__ key or pollute prototype', () => {
    const $form = document.createElement('form');
    $form.innerHTML = `
      <input name="user[__proto__][polluted]" value="yes">
    `;
    const formToObject = new FormToObject($form);
    const obj = formToObject.convertToObj();
    expect(obj).toEqual({});
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

});

