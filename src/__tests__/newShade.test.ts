import { newShade } from '../utils';

describe('newShade', () => {
  test('should return 0000ff', () => {
    expect(newShade('#ff0000', 50)).toEqual('#ff32ff');
  });
});
