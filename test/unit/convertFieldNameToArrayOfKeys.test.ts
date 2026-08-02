import {convertFieldNameToArrayOfKeys, DANGEROUS_KEYS, isDangerousKey} from "../../src/utils";

describe('convertFieldNameToArrayOfKeys', () => {
  it('field name is just a simple word', () => {
    expect(convertFieldNameToArrayOfKeys('fieldName')).toEqual(['fieldName']);
  });

  it('field name contains dot "."', () => {
    expect(convertFieldNameToArrayOfKeys('a.b')).toEqual(['a', 'b']);
  });

  it('field name contains brackets "[]"', () => {
    expect(convertFieldNameToArrayOfKeys('a[b][c][]')).toEqual(['a', 'b', 'c', '[]']);
  });

  it('returns empty array when field name contains dangerous keys (__proto__, constructor, prototype)', () => {
    expect(convertFieldNameToArrayOfKeys('__proto__')).toEqual([]);
    expect(convertFieldNameToArrayOfKeys('user.__proto__.name')).toEqual([]);
    expect(convertFieldNameToArrayOfKeys('user[constructor][name]')).toEqual([]);
    expect(convertFieldNameToArrayOfKeys('user[prototype][name]')).toEqual([]);
  });

  it('DANGEROUS_KEYS is immutable and frozen at runtime', () => {
    expect(Object.isFrozen(DANGEROUS_KEYS)).toBe(true);
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (DANGEROUS_KEYS as any).push('evil');
    }).toThrow(TypeError);
  });

  it('isDangerousKey correctly identifies dangerous keys and handles edge cases', () => {
    expect(isDangerousKey('__proto__')).toBe(true);
    expect(isDangerousKey('constructor')).toBe(true);
    expect(isDangerousKey('prototype')).toBe(true);
    expect(isDangerousKey('normalKey')).toBe(false);
    expect(isDangerousKey('')).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(isDangerousKey(123 as any)).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(isDangerousKey(null as any)).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(isDangerousKey(undefined as any)).toBe(false);
  });
});

