import {FormToObject} from "../../src/FormToObject";

describe('checkbox', () => {
  it('unchecked checkboxes, should return {}', () => {
    const $form = document.createElement('form');
    $form.innerHTML = `
        <input type="checkbox" name="single" value="single" />
        <input type="checkbox" name="many[]" value="many 0" />
        <input type="checkbox" name="many[]" value="many 1" />
        <input type="checkbox" name="more[first]" value="more first" />
        <input type="checkbox" name="more[second]" value="more second" />
    `;

    const formToObject = new FormToObject($form)

    expect(formToObject.convertToObj()).toEqual({});
  });

  it('a single checkbox without value attribute, should return the default value "on" as a string.', () => {
    const $form = document.createElement('form');
    $form.innerHTML = `
          <input type="checkbox" name="terms" checked/>
    `;

    const formToObject = new FormToObject($form);

    expect(formToObject.convertToObj()).toEqual({
      terms: "on"
    });
  });

  it('two checkboxes with the same name and different values should return the checked element value as an array', () => {
    const $form = document.createElement('form');
    $form.innerHTML = `
          <input type="checkbox" name="checkbox" value="first" checked/>
          <input type="checkbox" name="checkbox" value="second"/>
    `;

    const formToObject = new FormToObject($form);

    expect(formToObject.convertToObj()).toEqual({
      checkbox: ["first"]
    });
  });

  it('two checkboxes with the same name and different values, both checked, should return value as an array', () => {
    const $form = document.createElement('form');
    $form.innerHTML = `
          <input type="checkbox" name="checkbox" value="first" checked/>
          <input type="checkbox" name="checkbox" value="second" checked/>
    `;

    const formToObject = new FormToObject($form);

    expect(formToObject.convertToObj()).toEqual({
      checkbox: ["first", "second"]
    });
  });

  it('checkboxes named checkbox[] should return an array of values, by default', () => {
    const $form = document.createElement('form');
    $form.innerHTML = `
        <input type="checkbox" name="checkbox[]" value="first" checked />
        <input type="checkbox" name="checkbox[]" value="second" checked />
    `;

    const formToObject = new FormToObject($form);

    expect(formToObject.convertToObj()).toEqual({
      checkbox: ["first", "second"]
    });
  });

  it('checkboxes named checkbox[] should return an array of values, when checkBoxNameWithEmptyBracketsReturnsArray = false', () => {
    const $form = document.createElement('form');
    $form.innerHTML = `
        <input type="checkbox" name="checkbox[]" value="first" checked />
        <input type="checkbox" name="checkbox[]" value="second" checked />
    `;

    const formToObject = new FormToObject($form, { checkBoxNameWithEmptyBracketsReturnsArray: false });

    expect(formToObject.convertToObj()).toEqual({
      checkbox: {0: "first", 1: "second" }
    });
  });

  it('checkboxes named checkbox[a] and checkbox[b] return an object', () => {
    const $form = document.createElement('form');
    $form.innerHTML = `
        <input type="checkbox" name="checkbox[a]" value="a" checked />
        <input type="checkbox" name="checkbox[b]" value="b" checked />
    `;

    const formToObject = new FormToObject($form);

    expect(formToObject.convertToObj()).toEqual({
      checkbox: {"a": "a", "b": "b" }
    });
  });
});


