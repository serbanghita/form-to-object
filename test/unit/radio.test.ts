import {FormToObject} from "../../src/FormToObject";

describe('radio', () => {
  describe('unchecked radios', () => {
    it('searched by a valid element string should return false', () => {
      const $form = document.createElement('form');
      $form.innerHTML = `
        <input type="radio" name="first" value="First value" />
        <input type="radio" name="second" value="First value" />
        <input type="radio" name="third" value="First value" />
        <input type="radio" name="third" value="Second value" />
        <input type="radio" name="third" value="Third value" />
    `;
      const formToObject = new FormToObject($form);

      expect(formToObject.convertToObj()).toEqual({});
    });
  });

  describe('radio elements checked', () => {
    it('searched by a valid element string should return an object with checked elements', () =>{
      const $form = document.createElement('form');
      $form.innerHTML = `
        <input type="radio" name="first" value="First value from first" checked />
        <input type="radio" name="second" value="First value from second" checked="checked" />
        <input type="radio" name="third" value="First value" />
        <input type="radio" name="third" value="Second value" checked />
        <input type="radio" name="third" value="Third value" />
        <!--    // Numeric values-->
        <input type="radio" name="fourth" value="0" checked />
        <input type="radio" name="fourth" value="1" />
        <input type="radio" name="fourth" value="2" />
    `;
      const formToObject = new FormToObject($form);

      expect(formToObject.convertToObj()).toEqual({
        'first': 'First value from first',
        'second': 'First value from second',
        'third': 'Second value',
        'fourth': '0'
      });
    });

  });
});
