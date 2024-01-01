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
});
