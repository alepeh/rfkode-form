import { h } from '@stencil/core';
import { Schema } from '../components/form/form';
import { Factory } from './factory';
import { evaluate } from '../utils/formula';

export class BasicWidgetFactory implements Factory {

  inputs: any = {};

  produceWidget(schema: Schema, property: any, data: any) {
    const schemaType = this._getDataType(schema, property);
    if(schema && schema.jsonSchema){
      data[property] = this.evaluateFormulas(schema.jsonSchema.properties[property], property, data);
    }
    switch (schemaType) {
      case "string": return this.stringWidget(schema.jsonSchema.properties[property], property, data[property]);
      case "number": return this.numberWidget(schema.jsonSchema.properties[property], property, data[property]);
      case "boolean": return this.booleanWidget(schema.jsonSchema.properties[property], property, data[property]);
      case "array" : return this.arrayWidget(schema.jsonSchema.properties[property], property, data[property]);
      default: return this.textWidget(null, property, data[property]);
    }
  }

  evaluateFormulas(propertySchema: any, property: any, data: any) {
    if(propertySchema["default"] && ! data[property]){
      try{
        let defaultValue = evaluate(propertySchema["default"], data);
        this._onDataChangeCausedByFormulaEvaluation(property, defaultValue);
        return defaultValue;
      }
      catch(error){
        console.error(error);
      }
    }
    else if(propertySchema["calculated"]){
      try{
        let calculatedValue = evaluate(propertySchema["calculated"], data);
        if(calculatedValue != data[property]){
        this._onDataChangeCausedByFormulaEvaluation(property, calculatedValue);
      }
      return calculatedValue;
      }
      catch(error){
        console.error(error);
      }
    }
    return data[property];
  }

  _getDataType(schema: Schema, property: any) {
    if (!schema || ! schema.jsonSchema) {
      return "";
    }
    else {
      return schema.jsonSchema.properties[property].type;
    }
  }

  arrayWidget(schema: any, property: any, data: any) {
    return (
      <ion-item>
        <ion-label position="stacked">{property}</ion-label>
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
          <ion-label position="stacked">{property}</ion-label>
          <ion-select disabled={schema['calculated']} id={property} 
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
      let maxYear = (new Date().getFullYear() + 3).toString();
      return (
        <ion-item>
          <ion-label position="stacked">{property}</ion-label>
          <ion-datetime disabled={schema['calculated']} id={property} max={maxYear}
            onIonChange={() => this._onDataChanged(property, "date")}
            ref={(el) => this.inputs[property] = el}
            value={data}>
          </ion-datetime>
        </ion-item>
      )
    }
    else {
      return this.textWidget(schema, property, data);
    }
  }

  textWidget(schema: any, property: any, data: string) {
    let dis = false;
    if(schema && schema['calculated']){
      dis = true;
    } 
    return (
      <ion-item>
        <ion-label position="stacked">{property}</ion-label>
        <ion-input disabled={dis ? true : false} onIonInput={() => this._onDataChanged(property, "string")}
          type="text" id={property} value={data}
          ref={(el) => this.inputs[property] = el}
        ></ion-input>
      </ion-item>
    )
  }

  numberWidget(schema: any, property: any, data: string) {
    return (
      <ion-item>
        <ion-label position="stacked">{property}</ion-label>
        <ion-input disabled={schema['calculated']} onIonInput={() => this._onDataChanged(property, "number")}
          type="number" id={property} value={data}
          ref={(el) => this.inputs[property] = el}
        ></ion-input>
      </ion-item>
    )
  }

  booleanWidget(schema: any, property : any, data : string){
    return (
      <ion-item>
        <ion-label position="stacked">{property}</ion-label>
        <ion-toggle disabled={schema['calculated']} slot="end" 
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
    console.dir(ev);
    window.dispatchEvent(ev);
  }

  _onDataChangeCausedByFormulaEvaluation(property, value){
    let ev = new CustomEvent('data-changed',
      { detail: { property: property, value: value, source: 'formula'} });
    window.dispatchEvent(ev);
  }

  _formatValue(dataType : string, value : any){
    switch (dataType) {
      case "number": return Number(value);
      case "boolean": return Boolean(value);
      case "date": return value.indexOf("T") > 0 ? value.substring(0, value.indexOf("T")) : value; 
      default: return value;
    }
  }

}