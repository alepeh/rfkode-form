import { newE2EPage } from '@stencil/core/testing';

describe('rfkode-form', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<rfkode-form></rfkode-form>');
    const element = await page.find('rfkode-form');
    expect(element).toHaveClass('hydrated');
  });

  it('renders data without schema using text inputs only', async() => {
      const data = { prop1 : "value1" };
      const page = await newE2EPage();
      await page.setContent(`<rfkode-form></rfkode-form>`);
      const element = await page.find('rfkode-form');
      element.setProperty("data", data);
      await page.waitForChanges();
      const input = await page.find('rfkode-form >>> ion-input');
      expect(input.id).toEqual("prop1");
      let value = await input.getProperty("value");
      expect(value).toEqual("value1");
      //TODO check why we can'T access the value here.
      //expect(ionInput.getAttribute("value")).toEqual("value1");
  });

  it('emits dataChanged event when input is changed', async() => {
    const data = { prop1 : "value1" };
    const page = await newE2EPage();
    await page.setContent(`<rfkode-form></rfkode-form>`);
    let inputSpy = await page.spyOnEvent('dataChanged');
    const element = await page.find('rfkode-form');
    element.setProperty("data", data);
    await page.waitForChanges();
    const input = await page.find('rfkode-form >>> input');
    await input.press('A');
    await page.waitForChanges();
    expect(inputSpy).toHaveReceivedEvent();
    console.dir(inputSpy.firstEvent);
    expect(inputSpy.firstEvent.detail).toEqual({property : "prop1", value : "value1A"});
  });

});
