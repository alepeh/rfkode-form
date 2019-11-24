import { newSpecPage } from '@stencil/core/testing';
import { Form } from './form';

describe('rfkode-form', () => {
  it('builds', () => {
    expect(new Form()).toBeTruthy();
  });
});
