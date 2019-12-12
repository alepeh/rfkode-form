import { Component, Host, h, Prop, Event, EventEmitter, Listen } from '@stencil/core';
import { widgetFactory } from '../../widgets/widgetFactory';

@Component({
  tag: 'rfkode-form',
  styleUrl: 'form.css',
  shadow: true
})
export class Form {

  @Prop() data: Object = {};
  @Prop() schema: Schema;

  inputs: any = {};

  @Event() dataChanged: EventEmitter;

  render() {
    if (this.schema) {
      return (
        <Host>
          {Object.keys(this.schema.jsonSchema.properties).map((property) => {
            return this._getWidgetForProperty(property)
          })
        }
        </Host>
      )
    }
    else {
      return (
        <Host>
          {Object.keys(this.data).map((property) => {
            return this._getWidgetForProperty(property)
          })
        }
        </Host>
      )
    }
  }

  @Listen('data-changed', { target : 'window'})
  _onDataChanged(ev){
    this.dataChanged.emit(ev.detail);
    console.dir(ev);
  }

  _getWidgetForProperty(property){
    return widgetFactory.produceWidget(this.schema, property, this.data[property]);
  }

}
