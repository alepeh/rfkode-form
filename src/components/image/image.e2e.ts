import { newE2EPage } from '@stencil/core/testing';

describe('rfkode-image', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<rfkode-image></rfkode-image>');

    const element = await page.find('rfkode-image');
    expect(element).toHaveClass('hydrated');
  });
});
