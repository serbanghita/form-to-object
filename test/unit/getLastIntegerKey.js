describe('getLastIntegerKey', function() {
  it('when provided with invalid objects then it returns 0', function() {
    expect(getLastIntegerKey({})).toBe(0);
    expect(getLastIntegerKey([])).toBe(0);
    expect(getLastIntegerKey(null)).toBe(0);
    expect(getLastIntegerKey(undefined)).toBe(0);
  });

  it('when provided with an object with only numeric keys then it returns the last numeric key as integer', function() {
    expect(getLastIntegerKey({ 1:'first', 2: 'second', 3: 'third' })).toBe(3);
    expect(getLastIntegerKey({ 3:'first', 2: 'second', 1: 'third' })).toBe(1);
    expect(getLastIntegerKey({ 3:'first', 2: 'second', 0: 'third' })).toBe(0);
  });

  it('when provided with an object with mixed keys then it returns the last numeric key as integer', function() {
    expect(getLastIntegerKey({ 1: 'first', 2: 'second', three: 'third' })).toBe(2);
    expect(getLastIntegerKey({ 1: 'first', second: 'second', '3': 'third' })).toBe(3);
  });
});
