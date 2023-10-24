import {checkForLastNumericKey} from '../../src/functions';

describe('checkForLastNumericKey', () => {
  test('when provided with invalid objects then it returns undefined', function () {
    expect(checkForLastNumericKey({})).toBeUndefined();
    expect(checkForLastNumericKey([])).toBeUndefined();
    expect(checkForLastNumericKey(null)).toBeUndefined();
    expect(checkForLastNumericKey(undefined)).toBeUndefined();
  });

  test('when provided with an object with only numeric keys then it returns the last numeric key', () => {
    expect(checkForLastNumericKey({1: 'first', 2: 'second', 3: 'third'})).toBe('3');
    expect(checkForLastNumericKey({3: 'first', 2: 'second', 1: 'third'})).toBe('3');
    expect(checkForLastNumericKey({3: 'first', 2: 'second', 0: 'third'})).toBe('3');
  });

  test('when provided with an object with mixed keys then it returns the last numeric key', () => {
    expect(checkForLastNumericKey({1: 'first', 2: 'second', three: 'third'})).toBe('2');
    expect(checkForLastNumericKey({1: 'first', second: 'second', '3': 'third'})).toBe('3');
  });
});
