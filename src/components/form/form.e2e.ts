import { newE2EPage } from '@stencil/core/testing';

describe('rfkode-form', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<rfkode-form></rfkode-form>');
    const element = await page.find('rfkode-form');
    expect(element).toHaveClass('hydrated');
  });

  it('renders data without schema using text inputs only', async () => {
    const data = { prop1: "value1" };
    const page = await preparePage(null, data);
    const input = await page.find('rfkode-form >>> ion-input');
    expect(input.id).toEqual("prop1");
    let value = await input.getProperty("value");
    expect(value).toEqual("value1");
  });

  it('renders a numeric schema property without data correctly', async () => {
    const schema = { jsonSchema: { properties: { number1: { type: "number" } } } };
    const page = await preparePage(schema, null);
    const input = await page.find('rfkode-form >>> ion-input');
    let type = await input.getProperty("type");
    expect(type).toEqual("number");
    let value = await input.getProperty("value");
    expect(value).toEqual("");
  });

  it('renders string properties as text fields', async () => {
    const data = { string1: "string" };
    const schema = { jsonSchema: { properties: { string1: { type: "string" } } } };
    const page = await preparePage(schema, data);
    const input = await page.find('rfkode-form >>> ion-input');
    let type = await input.getProperty("type");
    expect(type).toEqual("text");
    let value = await input.getProperty("value");
    expect(value).toEqual("string");
  });

  it('renders enum properties as single select dropdowns', async () => {
    const data = { string1: "string1" };
    const schema = { jsonSchema: { properties: { string1: { type: "string", enum: ["string1", "string2"] } } } };
    const page = await preparePage(schema, data);
    const input = await page.find('rfkode-form >>> ion-select');
    let interface_ = await input.getProperty("interface");
    expect(interface_).toEqual("alert");
    let multipleSelect = await input.getProperty("multiple");
    expect(multipleSelect).toEqual(false);
    let value = await input.getProperty("value");
    expect(value).toEqual("string1");
  });

  it('renders numeric properties as number fields', async () => {
    const data = { number1: 123 };
    const schema = { jsonSchema: { properties: { number1: { type: "number" } } } };
    const page = await preparePage(schema, data);
    const input = await page.find('rfkode-form >>> ion-input');
    let type = await input.getProperty("type");
    expect(type).toEqual("number");
  });

  it('emits dataChanged event when input is changed', async () => {
    const data = { prop1: "value1" };
    const page = await preparePage(null, data);
    let inputSpy = await page.spyOnEvent('dataChanged');
    const input = await page.find('rfkode-form >>> input');
    await input.press('A');
    await page.waitForChanges();
    expect(inputSpy).toHaveReceivedEvent();
    expect(inputSpy.firstEvent.detail).toEqual({ property: "prop1", value: "value1A" });
  });

  it('emits dataChanged event when boolean is toggled', async () => {
    const data = { boolean1: true };
    const schema = { jsonSchema: { properties: { boolean1: { type: "boolean" } } } };
    const page = await preparePage(schema, data);
    let inputSpy = await page.spyOnEvent('dataChanged');
    let toggle = await page.find('rfkode-form >>> ion-toggle');
    toggle.setAttribute('checked', false);
    await page.waitForChanges();
    expect(inputSpy).toHaveReceivedEvent();
    expect(inputSpy.firstEvent.detail).toEqual({ property: "boolean1", value: false });
  });

  it('emits dataChanged event when dropdown selection is changed', async () => {
    const schema = { jsonSchema: { properties: { string1: { type: "string", enum: ["string1", "string2"] } } } };
    const page = await preparePage(schema, null);
    let inputSpy = await page.spyOnEvent('dataChanged');
    const input = await page.find('rfkode-form >>> #string1');
    await input.click();
    await page.waitForChanges();
    const option1 = await page.find('#alert-input-1-0');
    await option1.click();
    await page.waitForChanges();
    const buttons = await page.findAll('.alert-button');
    if (buttons) {
      await buttons[1].click();
    }
    await page.waitForChanges();
    expect(inputSpy).toHaveReceivedEvent();
    expect(inputSpy.firstEvent.detail).toEqual({ property: "string1", value: "string1" });
  });

  async function preparePage(schema: any, data: any) {
    const page = await newE2EPage();
    await page.setContent(`<rfkode-form></rfkode-form>`);
    const element = await page.find('rfkode-form');
    if (data) {
      element.setProperty("data", data);
    }
    if (schema) {
      element.setProperty("schema", schema);
    }
    await page.waitForChanges();
    return page;
  }
});