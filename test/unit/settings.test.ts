import {FormToObject} from "../../src/FormToObject";

describe('settings', () => {
  describe('phpStyleMultipleSelects', () => {
    it('when true, should return "multiple" key and array as value', () => {
      const $formEl = document.createElement('form');
      const $formInner = document.createElement('div');
      $formInner.innerHTML = `
    <select name="multiple[]" multiple>
        <option value="a" selected>a</option>
        <option value="b" selected>b</option>
    </select>
    `;
      $formEl.appendChild($formInner);

      const formToObject = new FormToObject($formEl, { phpStyleMultipleSelects: true });
      const result = formToObject.convertToObj();

      expect(result).toEqual({"multiple": ["a", "b"]});
    });

    it('when false, should return "multiple" key and multi-array as value', () => {
      const $formEl = document.createElement('form');
      const $formInner = document.createElement('div');
      $formInner.innerHTML = `
    <select name="multiple[]" multiple>
        <option value="a" selected>a</option>
        <option value="b" selected>b</option>
    </select>
    `;
      $formEl.appendChild($formInner);

      const formToObject = new FormToObject($formEl, { phpStyleMultipleSelects: false });
      const result = formToObject.convertToObj();

      expect(result).toEqual({"multiple": [["a", "b"]]});
    });

    // Note: this is a forced example.
    it('when false, should return "multiple" key and multi-arrays as value', () => {
      const $formEl = document.createElement('form');
      const $formInner = document.createElement('div');
      $formInner.innerHTML = `
    <select name="multiple[]" multiple>
        <option value="a" selected>a</option>
        <option value="b" selected>b</option>
    </select>
    <select name="multiple[]" multiple>
        <option value="c" selected>c</option>
        <option value="d" selected>d</option>
    </select>
    `;
      $formEl.appendChild($formInner);

      const formToObject = new FormToObject($formEl, { phpStyleMultipleSelects: false });
      const result = formToObject.convertToObj();

      expect(result).toEqual({"multiple": [["a", "b"], ["c", "d"]]});
    });

  });
});
