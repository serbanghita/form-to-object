import {convertFieldNameToArrayOfKeys} from "../../src/utils";

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
});
