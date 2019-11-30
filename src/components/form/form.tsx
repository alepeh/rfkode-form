import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'rfkode-form',
  styleUrl: 'form.css',
  shadow: true
})
export class Form {

  @Prop() data: Object;
  @Prop() schema: Schema;

  render() {
    console.log("Rendering: " + JSON.stringify(this.data));
    return (
      <Host>
        {Object.keys(this.data).map((property) => 
          <ion-item>
          <ion-label position="floating">{property}</ion-label>
          <ion-input id={property}>{this.data[property]}</ion-input>
        </ion-item>
        )}
      </Host>
    );
  }

}
