import {FormToObject} from "../../src/FormToObject";
import {NodeResult} from "../../src/types";

describe('FormToObject internal methods', () => {
  describe('initFormElements', () => {
    it('returns false when $form is null', () => {
      const $form = document.createElement('form');
      $form.innerHTML = '<input type="text" name="field" value="test">';

      const formToObject = new FormToObject($form);

      // Manually set $form to null to test the defensive code path
      formToObject.$form = null;

      expect(formToObject.initFormElements()).toBe(false);
    });
  });

  describe('processSingleLevelNode', () => {
    it('returns early for multiple select with empty string value', () => {
      const $form = document.createElement('form');
      $form.innerHTML = `
        <select name="items" multiple>
          <option value="a">A</option>
          <option value="b">B</option>
        </select>
      `;

      const formToObject = new FormToObject($form);
      const result: NodeResult = Object.create(null);
      const $select = $form.querySelector('select') as HTMLSelectElement;

      // Directly call processSingleLevelNode with empty string to test the defensive path
      const returnValue = formToObject.processSingleLevelNode($select, ['items'], '', result);

      // Should return undefined (early return) and not set result
      expect(returnValue).toBeUndefined();
      expect(result).toEqual({});
    });
  });
});
