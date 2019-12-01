import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'rfkode-form',
  styleUrl: 'form.css',
  shadow: true
})
export class Form {

  @Prop() data: Object;
  @Prop() schema: Schema;

  inputs: any = {};

  @Event() dataChanged: EventEmitter;

  render() {
    return (
      <Host>
        {Object.keys(this.data).map((property) => 
        <ion-item>
          <ion-label position="stacked">{property}</ion-label>
          <ion-input onIonInput={() => this._onDataChanged(property) } 
            type="text" id={property} value={this.data[property]}
            ref={(el) => this.inputs[property] = el}  
          ></ion-input>
        </ion-item>
        )}
      </Host>
    );
  }

  _onDataChanged(property){
    let newValue = this.inputs[property].value;
    let ev = { property : property,  value : newValue};
    this.dataChanged.emit(ev);
  }

}
