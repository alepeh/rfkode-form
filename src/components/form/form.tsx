import { Component, Host, h, Prop, Event, EventEmitter, Listen } from '@stencil/core';
import { widgetFactory } from '../../widgets/widgetFactory';

export type Schema = {
  jsonSchema : JsonSchema;
  uiSchema : Object;
  actions : Object;
}

export type JsonSchema = {
  properties : Object;
}

@Component({
  tag: 'rfkode-form',
  styleUrl: 'form.css',
  shadow: true
})
export class Form {

  @Prop() data: Object = {};
  @Prop() schema: Schema;

  inputs: any = {};

  @Event({bubbles: true}) dataChanged: EventEmitter;
  @Event({bubbles: true}) relatedElementAction: EventEmitter;
  @Event({bubbles: true}) attachmentChanged: EventEmitter;

  render() {
    console.log(this.schema);
    console.log(this.data);
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
  }

  @Listen('attachment-changed', { target : 'window'})
  _onAttachmentChanged(ev){
    this.attachmentChanged.emit(ev.detail);
  }

  @Listen('related-element-action', { target : 'window'})
  _onRelatedElementAction(ev){
    this.relatedElementAction.emit(ev.detail);
  }

  _getWidgetForProperty(property){
    return widgetFactory.produceWidget(this.schema, property, this.data);
  }
}