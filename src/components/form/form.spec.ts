import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { Form } from './form';

describe('rfkode-form', () => {
  const schema = {jsonSchema: { properties: { text1: {
    type: "string",
    default : "reference.text1"
    },
    text2: {
      type: "string",
      calculated: "reference.calculated"
      },
    text3: {
        type: "string",
        default : "reference.text1"
      } } } };
  const data = { text3: "valueAlreadySet", reference : { text1 : "defaultValue", calculated : "calculatedValue"}};

  it('builds', () => {
    expect(new Form()).toBeTruthy();
  });

  it('resolves the correct default value based on formula and data', async () => {
    const page = await preparePage(schema, data);
    expect(page.root.shadowRoot.querySelector('#text1').getAttribute('value')).toBe("defaultValue");
  });

  it('ignores the default value when data is already set', async () => {
    const page = await preparePage(schema, data);
    expect(page.root.shadowRoot.querySelector('#text3').getAttribute('value')).toBe("valueAlreadySet");
  });

  it('calculates the correct value based on formula and data', async () => {
    const page = await preparePage(schema, data);
    expect(page.root.shadowRoot.querySelector('#text2').getAttribute('value')).toBe("calculatedValue");
  });

  it('disables input for calculated fields', async () => {
    const page = await preparePage(schema, data);
    expect(page.root.shadowRoot.querySelector('#text2')).toHaveAttribute('disabled');
  });

  it('does not set a value when a variable in the formula is not bound', async () => {
    const schema1 = {jsonSchema: {properties : { text5: {type: "string", default : "_gobalContext.text2" }}}};
    const page = await preparePage(schema1, data);
    expect(page.root.shadowRoot.querySelector('#text5')).not.toHaveAttribute('value');
  });

  async function preparePage(schema1, data1) : Promise<SpecPage> {
    const page = await newSpecPage({
      components: [Form
      ],
      html: `<div></div>`,
    });
    let component = page.doc.createElement("rfkode-form");
    (component as any).data = data1;
    (component as any).schema = schema1;
    page.root.appendChild(component);
    await page.waitForChanges();
    return page;
  }
});
