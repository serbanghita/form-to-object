import {forEach} from "../../src/functions";

describe('forEach', function() {
  test('applies the callback on each of the array values', function() {
    const data = [1, 2, 3];
    forEach(data as never, function(value, index) {
          data[index] = ++value;
      });
      expect(data[0]).toBe(2);
      expect(data[1]).toBe(3);
      expect(data[2]).toBe(4);
  });
});
