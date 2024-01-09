import {screen} from "@testing-library/dom";
import userEvent from '@testing-library/user-event';
import {FormToObject} from "../../src/FormToObject";

describe('select', () => {
  afterEach(() => {
    // Clean the HTML from injected fixtures.
    document.body.innerHTML = '';
  })
  it('a select element and one valid selected option should return an object', () => {
    const $form = document.createElement('form');
    $form.innerHTML = `
      <select name="select">
          <option value="first">first</option>
          <option value="second" selected>second</option>
          <option value="three">three</option>
      </select>
    `;
    const formToObject = new FormToObject($form);

    expect(formToObject.convertToObj()).toEqual({'select':'second'});
  });

  it('a select element and no selected options should return the first option value', () => {
    const $form = document.createElement('form');
    $form.innerHTML = `
      <select name="select">
          <option value="first">first</option>
          <option value="second">second</option>
          <option value="three">three</option>
      </select>
    `;
    const formToObject = new FormToObject($form);

    expect(formToObject.convertToObj()).toEqual({'select':'first'});
  });

  describe('a select element and no selected options', ()=> {
    const $form = document.createElement('form');
    $form.innerHTML = `
      <select name="select">
          <option value="">--select--</option>
          <option value="first">first</option>
          <option value="second">second</option>
          <option value="third">third</option>
      </select>
    `;

    it('should return {} if the first option is empty', () => {
      const formToObject = new FormToObject($form);
      expect(formToObject.convertToObj()).toEqual({});
    });

    it('should return the first option if empty values option is set to true', () => {
      const formToObject = new FormToObject($form, {includeEmptyValuedElements: true});
      expect(formToObject.convertToObj()).toEqual({'select':''});
    });
  });

  describe('multiple select element', () => {
    const $form = document.createElement('form');
    $form.innerHTML = `
      <select name="multiple" multiple data-testid="multiple">
          <option value="">--select--</option>
          <option value="first">first</option>
          <option value="second">second</option>
          <option value="third">third</option>
      </select>
    `;

    it('should return {} when no options are selected', () => {
      const formToObject = new FormToObject($form);
      expect(formToObject.convertToObj()).toEqual({});
    });

    it('should return an empty array when no options are selected and includeEmptyValuedElements:true', () => {
      const formToObject = new FormToObject($form, {includeEmptyValuedElements: true});
      expect(formToObject.convertToObj()).toEqual({'multiple':[]});
    });

    it('should return an array with two elements when two options are selected', async () => {
      document.body.appendChild($form);
      const formToObject = new FormToObject($form);
      const user = userEvent.setup();

      const $multiple = screen.queryByTestId('multiple') as HTMLSelectElement;
      await user.selectOptions($multiple, ['second', 'third']);

      expect(formToObject.convertToObj()).toEqual({'multiple':['second', 'third']});
    });

    it('and name contains empty brackets []', async () => {
      const $form = document.createElement('form');
      $form.innerHTML = `
        <select id="select" data-testid="select" name="select[]" multiple>
            <option value="a" selected>a</option>
            <option value="b" selected>b</option>
        </select>
      `;
      document.body.appendChild($form);
      const formToObject = new FormToObject($form);
      const user = userEvent.setup();

      const $select = screen.queryByTestId('select') as HTMLSelectElement;
      await user.selectOptions($select, ['a', 'b']);

      expect(formToObject.convertToObj()).toEqual({'select':['a', 'b']});
    });
  });

});
