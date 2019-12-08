/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';


export namespace Components {
  interface RfkodeForm {
    'data': Object;
    'schema': Schema;
  }
}

declare global {


  interface HTMLRfkodeFormElement extends Components.RfkodeForm, HTMLStencilElement {}
  var HTMLRfkodeFormElement: {
    prototype: HTMLRfkodeFormElement;
    new (): HTMLRfkodeFormElement;
  };
  interface HTMLElementTagNameMap {
    'rfkode-form': HTMLRfkodeFormElement;
  }
}

declare namespace LocalJSX {
  interface RfkodeForm {
    'data'?: Object;
    'onDataChanged'?: (event: CustomEvent<any>) => void;
    'schema'?: Schema;
  }

  interface IntrinsicElements {
    'rfkode-form': RfkodeForm;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      'rfkode-form': LocalJSX.RfkodeForm & JSXBase.HTMLAttributes<HTMLRfkodeFormElement>;
    }
  }
}

