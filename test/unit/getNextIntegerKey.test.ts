import {getNextIntegerKey} from "../../src/utils";

describe('getNextIntegerKey', function() {
  it('when provided with invalid objects then it returns 0', function() {
    expect(getNextIntegerKey({})).toBe(0);
    expect(getNextIntegerKey([])).toBe(0);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(getNextIntegerKey(null)).toBe(0);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(getNextIntegerKey(undefined)).toBe(0);
  });

  it('when provided with an object with only numeric keys then it returns the next numeric key as integer', function() {
    expect(getNextIntegerKey({ 1:'first', 2: 'second', 3: 'third' })).toBe(4);
  });

  it('when provided with an object with mixed keys then it returns the next numeric key as integer', function() {
    expect(getNextIntegerKey({ 1: 'first', 2: 'second', three: 'third' })).toBe(3);
    expect(getNextIntegerKey({ 1: 'first', second: 'second', '3': 'third' })).toBe(4);
  });
});
