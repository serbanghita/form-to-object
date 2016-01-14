describe('init', function() {
  it('when receiving empty or falsy options parameter then it should return false', function() {
    expect(init(false)).toBe(false);
    expect(init(null)).toBe(false);
    expect(init(undefined)).toBe(false);
    expect(init([])).toBe(false);
    expect(init({})).toBe(false);
    expect(init(function(){})).toBe(false);
    expect(init('')).toBe(false);
  });
  
  it('when receiving an empty form or DOM element without input fields then it should return false', function() {
    expect(init(document.createElement('form'))).toBe(false);
    expect(init('non-existent')).toBe(false);
  });
});