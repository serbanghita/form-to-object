describe('forEach', function() {
  it('when iterating a valid array then it calls the callback for each item in the array', function() {
    var test = [];
    forEach([1, 2, 3, 4, 5], function(value) {
      test.push(value);
    });
    expect(test.length).toBe(5);
    expect(test[0]).toBe(1);
    expect(test[1]).toBe(2);
    expect(test[2]).toBe(3);
    expect(test[3]).toBe(4);
    expect(test[4]).toBe(5);
  });
  it('when iterating a valid object then the callback is not executed', function() {
    var test = [];
    forEach({ one: 1, two: 2, three: 3, four: 4, five: 5 }, function(value) {
      test.push(value);
    });
    expect(test.length).toBe(0);
    expect(test[0]).toBeUndefined();
  });
});