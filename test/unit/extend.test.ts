import {IFormToObjectOptions} from "../../src/types";
import {extend} from "../../src/utils";

describe('extend', () => {
  it('when given an empty destination and an object to be extended with then the destination object contains source properties', () => {
    const destination = {} as IFormToObjectOptions;
    const source = {includeDisabledFields: true, includeEmptyValuedElements: true};
    extend(destination, source);
    expect(destination.includeDisabledFields).toBe(true);
    expect(destination.includeEmptyValuedElements).toBe(true);
  });

  it('when given a destination and a source that has the same keys as destination then those key values will be overridden', () => {
    const destination = {includeDisabledFields: false, includeEmptyValuedElements: false};
    const source = {includeDisabledFields: true, includeEmptyValuedElements: true};
    extend(destination, source);
    expect(destination.includeDisabledFields).toBe(true);
    expect(destination.includeEmptyValuedElements).toBe(true);
  });

  it('when given a source that have more fields that the destination then the destination will inherit new source fields', () => {
    const destination = {includeDisabledFields: false, includeEmptyValuedElements: false, debug: false};
    const source = {includeDisabledFields: false, includeEmptyValuedElements: true};
    extend(destination, source);
    expect(destination.debug).toBeDefined();
    expect(destination.debug).toBe(false);
    expect(destination.includeDisabledFields).toBe(false);
    expect(destination.includeEmptyValuedElements).toBe(true);
  });

  it('when source has prototype pollution keys (__proto__, constructor, prototype) they are ignored', () => {
    const destination = {includeDisabledFields: false} as IFormToObjectOptions;
    const dangerousJson = '{"__proto__": {"polluted": true}, "constructor": {"prototype": {"polluted": true}}, "prototype": {"polluted": true}, "includeDisabledFields": true}';
    const source = JSON.parse(dangerousJson);
    extend(destination, source);
    expect(destination.includeDisabledFields).toBe(true);
    expect(Object.prototype.hasOwnProperty.call(destination, '__proto__')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(destination, 'constructor')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(destination, 'prototype')).toBe(false);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });
});

