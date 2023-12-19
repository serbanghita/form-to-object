import {getObjLength} from "../../src/utils";

describe('getObjLength', function() {
  it('when provided with invalid input then it returns 0', function() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(getObjLength(null)).toBe(0);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(getObjLength(false)).toBe(0);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(getObjLength('')).toBe(0);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(getObjLength(undefined)).toBe(0);
    expect(getObjLength(function(){})).toBe(0);
  });

  it('when provided with valid objects then it return the correct length', function() {
    expect(getObjLength({})).toBe(0);
    expect(getObjLength([])).toBe(0);
    expect(getObjLength({name: 'Serban', job: 'programmer'})).toBe(2);
  });

  it('when provided an object with prototype, it only includes values from the object', function() {
    const objParent = { p: 'p' };
    const obj = { a: 'a' };
    Object.setPrototypeOf(obj, objParent);

    expect(getObjLength(obj)).toBe(1);
  });

  it('when Object.keys is missing, it only includes values from the object', function() {
    const objParent = { p: 'p' };
    const obj = { a: 'a' };
    Object.setPrototypeOf(obj, objParent);

    const k = Object.keys;
    // @ts-expect-error Exception test
    delete Object.keys;

    // expect is using Object.keys :D, that's why we have to restore it in advance.
    // node_modules/expect/build/index.js:114
    const result = getObjLength(obj);
    Object.keys = k;

    expect(result).toBe(1);
  });
});
