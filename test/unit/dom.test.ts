import {getAllFormElementsAsArray, isDomElementNode, isUploadForm, isFileList, isRadio, isCheckbox, isFileField, isTextarea, isSelectSimple, isSelectMultiple, isSubmitButton, isChecked} from "../../src/dom";
describe('dom', () => {

  describe('getAllFormElementsAsArray', () => {
    it('querySelectorAll', () => {
      const $form = {querySelectorAll: () => ['a','b','c']};
      // @ts-ignore
      expect(getAllFormElementsAsArray($form)).toEqual(['a', 'b', 'c']);
    });
    it('getElementsByTagName', () => {
      const $form = {getElementsByTagName: (tagName: string) => [tagName, tagName]};
      // @ts-ignore
      expect(getAllFormElementsAsArray($form)).toEqual(['input', 'input', 'textarea', 'textarea', 'select', 'select']);
    });
    it('invalid DOM element', () => {
      expect(() => {
        const $form = {};
        // @ts-ignore
        getAllFormElementsAsArray($form)
      }).toThrow('The <form> is either not a valid DOM element or the browser is very old.');
    });
  });

  describe('isDomElementNode', () => {
    it('returns true for real DOM element nodes', () => {
      expect(isDomElementNode(<HTMLFormElement>document.body)).toBe(true);
      expect(isDomElementNode(<HTMLFormElement><unknown>document.createElement('div'))).toBe(true);
      expect(isDomElementNode(document.createElement('form'))).toBe(true);
    });

    it('returns false for real DOM nodes that are not elements', () => {
      expect(isDomElementNode(document as never)).toBe(false);
      expect(isDomElementNode(window as never)).toBe(false);
    });

    it('returns false for falsy nodes', () => {
      expect(isDomElementNode(null as never)).toBe(false);
      expect(isDomElementNode(false as never)).toBe(false);
      expect(isDomElementNode(true as never)).toBe(false);
      expect(isDomElementNode({} as never)).toBe(false);
      expect(isDomElementNode([] as never)).toBe(false);
    });
  });

  describe('isUploadForm', () => {
    it('returns true when enctype is multipart/form-data', () => {
      const form = { enctype: 'multipart/form-data' } as HTMLFormElement;
      expect(isUploadForm(form)).toBe(true);
    });

    it('returns false when enctype is not multipart/form-data', () => {
      const form = { enctype: 'application/x-www-form-urlencoded' } as HTMLFormElement;
      expect(isUploadForm(form)).toBe(false);
    });

    it('returns false when enctype is empty', () => {
      const form = { enctype: '' } as HTMLFormElement;
      expect(isUploadForm(form)).toBe(false);
    });
  });

  describe('isFileList', () => {
    it('returns true when files is a FileList', () => {
      const input = document.createElement('input');
      input.type = 'file';
      // In jsdom, the files property is a FileList
      expect(isFileList(input)).toBe(true);
    });

    it('returns false when FileList is not available', () => {
      const originalFileList = window.FileList;
      // @ts-expect-error - testing when FileList is unavailable
      delete window.FileList;

      const input = { files: [] } as unknown as HTMLInputElement;
      // When FileList is undefined, the function returns falsy (undefined)
      expect(isFileList(input)).toBeFalsy();

      // Restore
      (window as unknown as { FileList: typeof FileList }).FileList = originalFileList;
    });
  });

  describe('isRadio', () => {
    it('returns true for radio input', () => {
      const input = document.createElement('input');
      input.type = 'radio';
      expect(isRadio(input)).toBe(true);
    });

    it('returns false for non-radio input', () => {
      const input = document.createElement('input');
      input.type = 'text';
      expect(isRadio(input)).toBe(false);
    });
  });

  describe('isCheckbox', () => {
    it('returns true for checkbox input', () => {
      const input = document.createElement('input');
      input.type = 'checkbox';
      expect(isCheckbox(input)).toBe(true);
    });

    it('returns false for non-checkbox input', () => {
      const input = document.createElement('input');
      input.type = 'text';
      expect(isCheckbox(input)).toBe(false);
    });
  });

  describe('isFileField', () => {
    it('returns true for file input', () => {
      const input = document.createElement('input');
      input.type = 'file';
      expect(isFileField(input)).toBe(true);
    });

    it('returns false for non-file input', () => {
      const input = document.createElement('input');
      input.type = 'text';
      expect(isFileField(input)).toBe(false);
    });
  });

  describe('isTextarea', () => {
    it('returns true for textarea', () => {
      const textarea = document.createElement('textarea');
      expect(isTextarea(textarea)).toBe(true);
    });

    it('returns false for non-textarea', () => {
      const input = document.createElement('input');
      expect(isTextarea(input)).toBe(false);
    });
  });

  describe('isSelectSimple', () => {
    it('returns true for single select', () => {
      const select = document.createElement('select');
      expect(isSelectSimple(select)).toBe(true);
    });

    it('returns false for multiple select', () => {
      const select = document.createElement('select');
      select.multiple = true;
      expect(isSelectSimple(select)).toBe(false);
    });
  });

  describe('isSelectMultiple', () => {
    it('returns true for multiple select', () => {
      const select = document.createElement('select');
      select.multiple = true;
      expect(isSelectMultiple(select)).toBe(true);
    });

    it('returns false for single select', () => {
      const select = document.createElement('select');
      expect(isSelectMultiple(select)).toBe(false);
    });
  });

  describe('isSubmitButton', () => {
    it('returns true for submit input', () => {
      const input = document.createElement('input');
      input.type = 'submit';
      expect(isSubmitButton(input)).toBe(true);
    });

    it('returns true for submit button', () => {
      const button = document.createElement('button');
      button.type = 'submit';
      expect(isSubmitButton(button)).toBe(true);
    });

    it('returns false for non-submit input', () => {
      const input = document.createElement('input');
      input.type = 'text';
      expect(isSubmitButton(input)).toBe(false);
    });
  });

  describe('isChecked', () => {
    it('returns true when checked', () => {
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = true;
      expect(isChecked(input)).toBe(true);
    });

    it('returns false when not checked', () => {
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = false;
      expect(isChecked(input)).toBe(false);
    });
  });
});
