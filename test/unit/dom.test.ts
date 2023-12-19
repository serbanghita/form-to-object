import {getAllFormElementsAsArray, isDomElementNode} from "../../src/dom";
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
      }).toThrowError('The <form> is either not a valid DOM element or the browser is very old.');
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
});
