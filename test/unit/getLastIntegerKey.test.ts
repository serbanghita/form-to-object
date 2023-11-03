import {getLastIntegerKey} from "../../src/utils";

describe('getLastIntegerKey', () => {
  it('when provided with invalid objects then it returns 0', () => {
    expect(getLastIntegerKey({})).toBe(0);
    expect(getLastIntegerKey([])).toBe(0);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(getLastIntegerKey(null)).toBe(0);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(getLastIntegerKey(undefined)).toBe(0);
  });

  it('when provided with an object with only numeric keys then it returns the last numeric key as integer', () => {
    expect(getLastIntegerKey({ 1:'first', 2: 'second', 3: 'third' })).toBe(3);
    expect(getLastIntegerKey({ 3:'first', 2: 'second', 1: 'third' })).toBe(3);
    expect(getLastIntegerKey({ 3:'first', 2: 'second', 0: 'third' })).toBe(3);
  });

  it('when provided with an object with mixed keys then it returns the last numeric key as integer', () => {
    expect(getLastIntegerKey({ 1: 'first', 2: 'second', three: 'third' })).toBe(2);
    expect(getLastIntegerKey({ 1: 'first', second: 'second', '3': 'third' })).toBe(3);
  });
});
