describe('checkForLastNumericKey', function() {
  it('returns an integer', function() {
    expect(checkForLastNumericKey({})).toBe(0);
    expect(checkForLastNumericKey([])).toBe(0);
  });
});
