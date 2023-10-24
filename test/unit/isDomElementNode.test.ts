import {isDomElementNode} from "../../src/functions";

describe('isDomElementNode', function() {
  it('returns true for real DOM element nodes', function() {
    expect(isDomElementNode(document.body)).toBe(true);
    expect(isDomElementNode(document.createElement('div'))).toBe(true);
    expect(isDomElementNode(document.createElement('form'))).toBe(true);
  });

  it('returns false for real DOM nodes that are not elements', function() {
    expect(isDomElementNode(document as never)).toBe(false);
    expect(isDomElementNode(window as never)).toBe(false);
  });

  it('returns false for falsy nodes', function() {
    expect(isDomElementNode(null as never)).toBe(false);
    expect(isDomElementNode(false as never)).toBe(false);
    expect(isDomElementNode(true as never)).toBe(false);
    expect(isDomElementNode({} as never)).toBe(false);
    expect(isDomElementNode([] as never)).toBe(false);
  });
});
