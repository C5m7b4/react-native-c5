import { newShade } from '../utils';

describe('newShade', () => {
  test('should return 0000ff', () => {
    expect(newShade('#ff0000', 50)).toEqual('#ff32ff');
    expect(newShade('#00ff00', 50)).toEqual('#32ffff');
    expect(newShade('#fff', 50)).toEqual('fff');
    expect(newShade('#00ffff', 50)).toEqual('#32ffff');
  });
});
