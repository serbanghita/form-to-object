describe('getObjLength', function() {
  it('when provided with invalid input then it returns 0', function() {
    expect(getObjLength(null)).toBe(0);
    expect(getObjLength(false)).toBe(0);
    expect(getObjLength('')).toBe(0);
    expect(getObjLength(undefined)).toBe(0);
    expect(getObjLength(function(){})).toBe(0);
  });

  it('when provided with valid objects then it return the correct length', function() {
    expect(getObjLength({})).toBe(0);
    expect(getObjLength([])).toBe(0);
    expect(getObjLength({name: 'Serban', job: 'programmer'})).toBe(2);
  });
});