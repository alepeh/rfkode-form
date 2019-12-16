import { Signature } from './signature';

describe('rfk-signature', () => {
  it('builds', () => {
    expect(new Signature()).toBeTruthy();
  });
});
