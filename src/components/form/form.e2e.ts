import { newE2EPage } from '@stencil/core/testing';

describe('rfkode-form', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<rfkode-form></rfkode-form>');

    const element = await page.find('rfkode-form');
    expect(element).toHaveClass('hydrated');
  });

  it('renders data without schema using text inputs only', async() => {
      const data = { prop1 : "value1" ,  prop2 : "value2"};
      const page = await newE2EPage();
      await page.setContent(`<rfkode-form></rfkode-form>`);
      const element = await page.find('rfkode-form');
      element.setProperty("data", data);
      await page.waitForChanges();
      expect(element.shadowRoot.querySelectorAll('ion-input').length).toEqual(2);
      expect(element.shadowRoot.querySelectorAll('ion-input')[0]).toEqualText("value1");
      expect(element.shadowRoot.querySelectorAll('ion-input')[0].id).toEqual("prop1");
  });

});
