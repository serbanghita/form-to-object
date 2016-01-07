describe('isDomElementNode', function() {
  it('returns true for real DOM element nodes', function() {
    expect(isDomElementNode(document.body)).toBe(true);
    expect(isDomElementNode(document.createElement('div'))).toBe(true);
    expect(isDomElementNode(document.createElement('form'))).toBe(true);
  });

  it('returns false for real DOM nodes that are not elements', function() {
    expect(isDomElementNode(document)).toBe(false);
    expect(isDomElementNode(window)).toBe(false);
  });

  it('returns false for falsy nodes', function() {
    expect(isDomElementNode(null)).toBe(false);
    expect(isDomElementNode(false)).toBe(false);
    expect(isDomElementNode(true)).toBe(false);
    expect(isDomElementNode({})).toBe(false);
    expect(isDomElementNode([])).toBe(false);
  });
});
