import {
  getRadioValue,
  getCheckboxValue,
  getFileValue,
  getTextareaValue,
  getSelectSimpleValue,
  getSelectMultipleValue,
  getSubmitButtonValue,
  getInputValue
} from "../../src/handlers";

describe('handlers', () => {
  describe('getRadioValue', () => {
    it('returns value when checked', () => {
      const input = { checked: true, value: 'test' } as HTMLInputElement;
      expect(getRadioValue(input)).toBe('test');
    });

    it('returns false when not checked', () => {
      const input = { checked: false, value: 'test' } as HTMLInputElement;
      expect(getRadioValue(input)).toBe(false);
    });
  });

  describe('getCheckboxValue', () => {
    it('returns value when checked', () => {
      const input = { checked: true, value: 'yes' } as HTMLInputElement;
      expect(getCheckboxValue(input)).toBe('yes');
    });

    it('returns false when not checked', () => {
      const input = { checked: false, value: 'yes' } as HTMLInputElement;
      expect(getCheckboxValue(input)).toBe(false);
    });
  });

  describe('getFileValue', () => {
    it('returns false when form is null', () => {
      const input = { value: 'file.txt' } as HTMLInputElement;
      expect(getFileValue(input, null)).toBe(false);
    });

    it('returns false when form is not an upload form', () => {
      const input = { value: 'file.txt' } as HTMLInputElement;
      const form = { enctype: 'application/x-www-form-urlencoded' } as HTMLFormElement;
      expect(getFileValue(input, form)).toBe(false);
    });

    it('returns FileList when form is upload form and files exist', () => {
      const mockFileList = { length: 1 } as FileList;
      const input = {
        value: 'C:\\fakepath\\file.txt',
        files: mockFileList
      } as HTMLInputElement;
      const form = { enctype: 'multipart/form-data' } as HTMLFormElement;

      // Mock window.FileList
      const originalFileList = window.FileList;
      (window as unknown as { FileList: typeof FileList }).FileList = function() {} as unknown as typeof FileList;
      Object.defineProperty(input, 'files', {
        value: mockFileList,
        writable: true
      });
      // Make files instanceof FileList work
      Object.setPrototypeOf(mockFileList, (window as unknown as { FileList: { prototype: object } }).FileList.prototype);

      const result = getFileValue(input, form);
      expect(result).toBe(mockFileList);

      // Restore
      (window as unknown as { FileList: typeof FileList | undefined }).FileList = originalFileList;
    });

    it('returns value string when form is upload form but FileList is not available', () => {
      const input = { value: 'file.txt', files: null } as unknown as HTMLInputElement;
      const form = { enctype: 'multipart/form-data' } as HTMLFormElement;

      // Mock window.FileList to be undefined
      const originalFileList = window.FileList;
      (window as unknown as { FileList: undefined }).FileList = undefined;

      const result = getFileValue(input, form);
      expect(result).toBe('file.txt');

      // Restore
      (window as unknown as { FileList: typeof FileList | undefined }).FileList = originalFileList;
    });

    it('returns false when form is upload form but value is empty', () => {
      const input = { value: '', files: null } as unknown as HTMLInputElement;
      const form = { enctype: 'multipart/form-data' } as HTMLFormElement;

      // Mock window.FileList to be undefined
      const originalFileList = window.FileList;
      (window as unknown as { FileList: undefined }).FileList = undefined;

      const result = getFileValue(input, form);
      expect(result).toBe(false);

      // Restore
      (window as unknown as { FileList: typeof FileList | undefined }).FileList = originalFileList;
    });
  });

  describe('getTextareaValue', () => {
    it('returns value when non-empty', () => {
      const textarea = { value: 'hello' } as HTMLTextAreaElement;
      expect(getTextareaValue(textarea)).toBe('hello');
    });

    it('returns false when empty', () => {
      const textarea = { value: '' } as HTMLTextAreaElement;
      expect(getTextareaValue(textarea)).toBe(false);
    });
  });

  describe('getSelectSimpleValue', () => {
    it('returns value when selected', () => {
      const select = { value: 'option1' } as HTMLSelectElement;
      expect(getSelectSimpleValue(select)).toBe('option1');
    });

    it('returns first option value when no value selected but first option has value', () => {
      const select = {
        value: '',
        options: [{ value: 'first' }, { value: 'second' }]
      } as unknown as HTMLSelectElement;
      (select.options as unknown as { length: number }).length = 2;
      expect(getSelectSimpleValue(select)).toBe('first');
    });

    it('returns false when no value and first option is empty', () => {
      const select = {
        value: '',
        options: [{ value: '' }]
      } as unknown as HTMLSelectElement;
      (select.options as unknown as { length: number }).length = 1;
      expect(getSelectSimpleValue(select)).toBe(false);
    });

    it('returns false when no options', () => {
      const select = {
        value: '',
        options: []
      } as unknown as HTMLSelectElement;
      (select.options as unknown as { length: number }).length = 0;
      expect(getSelectSimpleValue(select)).toBe(false);
    });
  });

  describe('getSelectMultipleValue', () => {
    it('returns array of selected values', () => {
      const select = {
        options: [
          { value: 'a', selected: true },
          { value: 'b', selected: false },
          { value: 'c', selected: true }
        ]
      } as unknown as HTMLSelectElement;
      (select.options as unknown as { length: number }).length = 3;
      expect(getSelectMultipleValue(select, false)).toEqual(['a', 'c']);
    });

    it('returns empty array when includeEmptyValuedElements is true and nothing selected', () => {
      const select = {
        options: [
          { value: 'a', selected: false },
          { value: 'b', selected: false }
        ]
      } as unknown as HTMLSelectElement;
      (select.options as unknown as { length: number }).length = 2;
      expect(getSelectMultipleValue(select, true)).toEqual([]);
    });

    it('returns false when nothing selected and includeEmptyValuedElements is false', () => {
      const select = {
        options: [
          { value: 'a', selected: false },
          { value: 'b', selected: false }
        ]
      } as unknown as HTMLSelectElement;
      (select.options as unknown as { length: number }).length = 2;
      expect(getSelectMultipleValue(select, false)).toBe(false);
    });

    it('returns false when no options exist', () => {
      const select = { options: [] } as unknown as HTMLSelectElement;
      (select.options as unknown as { length: number }).length = 0;
      expect(getSelectMultipleValue(select, false)).toBe(false);
    });

    it('returns false when options is undefined', () => {
      const select = {} as HTMLSelectElement;
      expect(getSelectMultipleValue(select, false)).toBe(false);
    });
  });

  describe('getSubmitButtonValue', () => {
    it('returns false when includeSubmitButton is false', () => {
      const button = { value: 'Submit' } as HTMLButtonElement;
      expect(getSubmitButtonValue(button, false)).toBe(false);
    });

    it('returns value when includeSubmitButton is true and value exists', () => {
      const button = { value: 'Submit', innerText: 'Click Me' } as HTMLButtonElement;
      expect(getSubmitButtonValue(button, true)).toBe('Submit');
    });

    it('returns innerText when includeSubmitButton is true and value is empty', () => {
      const button = { value: '', innerText: 'Click Me' } as HTMLButtonElement;
      expect(getSubmitButtonValue(button, true)).toBe('Click Me');
    });

    it('returns false when includeSubmitButton is true but both value and innerText are empty', () => {
      const button = { value: '', innerText: '' } as HTMLButtonElement;
      expect(getSubmitButtonValue(button, true)).toBe(false);
    });
  });

  describe('getInputValue', () => {
    it('returns value when non-empty', () => {
      const input = { value: 'test' } as HTMLInputElement;
      expect(getInputValue(input, false)).toBe('test');
    });

    it('returns empty string when value is empty and includeEmptyValuedElements is true', () => {
      const input = { value: '' } as HTMLInputElement;
      expect(getInputValue(input, true)).toBe('');
    });

    it('returns false when value is empty and includeEmptyValuedElements is false', () => {
      const input = { value: '' } as HTMLInputElement;
      expect(getInputValue(input, false)).toBe(false);
    });

    it('returns false when value is undefined', () => {
      const input = {} as HTMLInputElement;
      expect(getInputValue(input, false)).toBe(false);
    });

    it('returns false when value is undefined even with includeEmptyValuedElements true', () => {
      const input = {} as HTMLInputElement;
      expect(getInputValue(input, true)).toBe(false);
    });
  });
});
