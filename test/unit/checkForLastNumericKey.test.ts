import {checkForLastNumericKey} from "../../src/utils";

describe('checkForLastNumericKey', () => {
  it('when provided with invalid objects then it returns undefined', () => {
    expect(checkForLastNumericKey({})).toBeUndefined();
    expect(checkForLastNumericKey([])).toBeUndefined();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(checkForLastNumericKey(null)).toBeUndefined();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(checkForLastNumericKey(undefined)).toBeUndefined();
  });

  it('when provided with an object with only numeric keys then it returns the last numeric key', () => {
    expect(checkForLastNumericKey({1: 'first', 2: 'second', 3: 'third'})).toBe('3');
    expect(checkForLastNumericKey({3: 'first', 2: 'second', 1: 'third'})).toBe('3');
    expect(checkForLastNumericKey({3: 'first', 2: 'second', 0: 'third'})).toBe('3');
  });

  it('when provided with an object with mixed keys then it returns the last numeric key', () => {
    expect(checkForLastNumericKey({1: 'first', 2: 'second', three: 'third'})).toBe('2');
    expect(checkForLastNumericKey({1: 'first', second: 'second', '3': 'third'})).toBe('3');
  });
});
