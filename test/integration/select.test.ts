import {readIntegrationFixture} from "../helpers";
import {screen} from "@testing-library/dom";
import userEvent from '@testing-library/user-event';
import formToObject from "../../src";

describe('select', () => {
  test('A form with a select element and one valid selected option should return an object', () => {
    document.body.innerHTML = readIntegrationFixture("select/select1.html");
    const $form = screen.queryByTestId('testForm') as HTMLFormElement;

    expect(formToObject($form)).toEqual({'country':'MC'});
  });

  test('A form with a select element and no selected options should return the first option value', () => {
    document.body.innerHTML = readIntegrationFixture("select/select2.html");
    const $form = screen.queryByTestId('testForm') as HTMLFormElement;

    expect(formToObject($form)).toEqual({'country':'RO'});
  });

  describe('An form with a select element and no selected options', ()=> {
    document.body.innerHTML = readIntegrationFixture("select/select3.html");
    const $form = screen.queryByTestId('testForm') as HTMLFormElement;

    it('should return false if the first option is empty', () =>{
      expect(formToObject($form)).toBe(false);
    });

    it('should return the first option if empty values option is set to true', () => {
      expect(formToObject($form, {includeEmptyValuedElements: true})).toEqual({'country':''});
    });
  });

  describe('An HTML form with a multiple select element', () => {
    document.body.innerHTML = readIntegrationFixture("select/select4.html");
    const $form = screen.queryByTestId('testForm') as HTMLFormElement;

    it('should return false when no options are selected', () =>{
      expect(formToObject($form)).toBe(false);
    });

    it('should return an empty array when no options are selected and include empty values option is true', () => {
      expect(formToObject($form, {includeEmptyValuedElements: true})).toEqual({'countries':[]});
    });

    it('should return an array with two elements when two options are selected', async () => {
      document.body.innerHTML = readIntegrationFixture("select/select4.html");
      const $form = screen.queryByTestId('testForm') as HTMLFormElement;
      const user = userEvent.setup();

      const $countries = screen.queryByTestId('countries') as HTMLSelectElement;
      await user.selectOptions($countries, ['Romania', 'Monaco']);

      expect(formToObject($form)).toEqual({'countries':['RO', 'MC']});
    });
  });

  describe('A form with a select element and options dont have value attribute', () =>{
    document.body.innerHTML = readIntegrationFixture("select/select5.html");
    const $form = screen.queryByTestId('testForm') as HTMLFormElement;

    it('should return the label of the first option element', () => {
      expect(formToObject($form)).toEqual({'countries': 'Romania'});
    });
  });

});
