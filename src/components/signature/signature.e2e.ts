import { newE2EPage } from '@stencil/core/testing';

describe('rfk-signature', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<rfk-signature></rfk-signature>');

    const element = await page.find('rfk-signature');
    expect(element).toHaveClass('hydrated');
  });
});
