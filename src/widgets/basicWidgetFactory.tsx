import { h } from '@stencil/core';

export class BasicWidgetFactory implements Factory {

  inputs: any = {};

  produceWidget(schema: Schema, property: any, data: any) {
    const schemaType = this._getDataType(schema, property);
    switch (schemaType) {
      case "string": return this.stringWidget(schema.jsonSchema.properties[property], property, data);
      case "number": return this.numberWidget(property, data);
      case "boolean": return this.booleanWidget(property, data);
      case "array" : return this.arrayWidget(schema.jsonSchema.properties[property], property, data);
      default: return this.textWidget(property, data);
    }
  }

  _getDataType(schema: Schema, property: any) {
    if (!schema) {
      return "";
    }
    else {
      return schema.jsonSchema.properties[property].type;
    }
  }

  arrayWidget(schema: any, property: any, data: any) {
    console.log(data);
    return (
      <ion-item>
        <ion-label>{property}</ion-label>
        <ion-select id={property} 
          onIonChange={() => this._onDataChanged(property, "array")} 
          ref={(el) => this.inputs[property] = el} 
          multiple 
          value={data}
          placeholder="Select">
          {schema.items.enum.map((enumProperty) => {
            return <ion-select-option id={enumProperty} value={enumProperty}>{enumProperty}</ion-select-option>
          })}
        </ion-select>
      </ion-item>
    )
  }

  stringWidget(schema: any, property: any, data: string) {
    if (schema.enum) {
      return (
        <ion-item>
          <ion-label>{property}</ion-label>
          <ion-select id={property} 
            onIonChange={() => this._onDataChanged(property, "string")} 
            ref={(el) => this.inputs[property] = el}
            value={data} 
            placeholder="Select One">
            {schema.enum.map((enumProperty) => {
              return <ion-select-option id={enumProperty} value={enumProperty}>{enumProperty}</ion-select-option>
            })}
          </ion-select> 
        </ion-item>
      )
    }
    else if (schema.format && schema.format === "date"){
      return (
        <ion-item>
          <ion-label>{property}</ion-label>
          <ion-datetime id={property} 
            onIonChange={() => this._onDataChanged(property, "date")} 
            ref={(el) => this.inputs[property] = el}
            value={data}>
          </ion-datetime>
        </ion-item>
      )
    }
    else {
      return this.textWidget(property, data);
    }
  }

  textWidget(property: any, data: string) {
    return (
      <ion-item>
        <ion-label position="stacked">{property}</ion-label>
        <ion-input onIonInput={() => this._onDataChanged(property, "string")}
          type="text" id={property} value={data}
          ref={(el) => this.inputs[property] = el}
        ></ion-input>
      </ion-item>
    )
  }

  numberWidget(property: any, data: string) {
    return (
      <ion-item>
        <ion-label position="stacked">{property}</ion-label>
        <ion-input onIonInput={() => this._onDataChanged(property, "number")}
          type="number" id={property} value={data}
          ref={(el) => this.inputs[property] = el}
        ></ion-input>
      </ion-item>
    )
  }

  booleanWidget(property : any, data : string){
    return (
      <ion-item>
        <ion-label>{property}</ion-label>
        <ion-toggle slot="end" 
          id={property} 
          checked={Boolean(data)}
          onIonChange={() => this._onDataChanged(property, "boolean", 'checked')}
          ref={(el) => this.inputs[property] = el}  
        ></ion-toggle>
      </ion-item>
    )
  }

  _onDataChanged(property : string, dataType : string, valueAttribute ? : string) {
    let _valueAttribute = valueAttribute ? valueAttribute : 'value';
    let newValue = this.inputs[property][_valueAttribute];
    let ev = new CustomEvent('data-changed',
      { detail: { property: property, value: this._formatValue(dataType, newValue)} });
    window.dispatchEvent(ev);
  }

  _formatValue(dataType : string, value : any){
    switch (dataType) {
      case "number": return Number(value);
      case "boolean": return Boolean(value);
      case "date": return value.substring(0, value.indexOf("T"));   
      default: return value;
    }
  }

}