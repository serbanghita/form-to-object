import {IFormToObjectOptions} from "../../src/types";
import {extend} from "../../src/utils";

describe('extend', function() {
  test('when given an empty destination and an object to be extended with then the destination object contains source properties', function() {
    const me = {} as IFormToObjectOptions;
    const him = {name: 'Serban', job: 'programmer'};
    extend(me, him);
    expect(me.name).toBe('Serban');
    expect(me.job).toBe('programmer');
  });

  test('when given a destination and a source that has the same keys as destination then those key values will be overridden', function() {
    const me = {name: 'Serban', job: 'programmer'};
    const him = {name: 'Bob', job: 'artist'};
    extend(me, him);
    expect(me.name).toBe('Bob');
    expect(me.job).toBe('artist');
  });

  test('when given a source that have more fields that the destination then the destination will inherit new source fields', function() {
    const me = {name: 'Serban', age: 32, sex: 'male'};
    const him = {name: 'Serban', age: 33} as IFormToObjectOptions;
    extend(him, me);
    expect(him.sex).toBeDefined();
    expect(him.sex).toBe('male');
  });
});
