import { h } from '@stencil/core';
import { Schema } from '../components/form/form';
import { Factory } from './factory';

export class AdvancedWidgetFactory implements Factory {

    inputs: any = {};

    produceWidget(schema: Schema, property: string, data: any) {
        console.log(schema);
        console.log(property);
        console.log(data);
        const widgetType = this._getWidgetType(schema, property);
        switch (widgetType) {
            case ("selectRelated"):
                return this.selectRelatedWidget(property, data[property] ? Array(data[property]) : null);
            case ("selectMultipleRelated"): return this.selectRelatedWidget(property, data[property], true);
            case ("textarea"): return this.textAreaWidget(property, data[property]);
            case ("signature"): return this.signatureWidget(property, data[property]);
            default: return this.unsupportedWidget(property, data[property]);
        }
    }

    signatureWidget(property: string, data: any) {
        console.log(property + " " + data);
        return(
            <ion-item>
                <p>
                    <ion-label position="stacked">{property}</ion-label>
                </p>
                <rfk-signature value={data} fieldName={property}></rfk-signature>
            </ion-item>
        );
    }
    textAreaWidget(property: string, data: any) {
        return (
            <ion-item>
                <ion-label position="stacked">{property}</ion-label>
                <ion-textarea value={data} onIonInput={() => this._onDataChanged(property)}
                ref={(el) => this.inputs[property] = el}
                ></ion-textarea>
            </ion-item>
        )
    }

    selectRelatedWidget(property: string, data: Array<any>, multiple?: boolean) {
        return (
            <ion-list>
                <ion-list-header>
                    <ion-label>{property}</ion-label>
                    <ion-button disabled={(!multiple && data != null)} onClick={() => this._onRelatedElement(property, null, "new")}>+</ion-button>
                </ion-list-header>
                {(data && data.length > 0) ? data.map(item => {
                    return (
                        <ion-item detail>
                            <ion-label onClick={() => this._onRelatedElement(property, item._id, "view")}>{item._id}</ion-label>
                            <ion-button onClick={() => this._onRelatedElement(property, item._id, "edit")} slot="end">Change</ion-button>
                        </ion-item>
                    )
                }) : ""}
            </ion-list>
        )
    }

    unsupportedWidget(property: string, data: any) {
        return (
            <ion-item>
                <ion-label color="danger" position="stacked">Unknown Widget For: {property}</ion-label>
                <ion-input
                    type="text" id={property} value={data}
                ></ion-input>
            </ion-item>
        )
    }

    _getWidgetType(schema: Schema, property: any) {
        return schema.uiSchema[property].widget;
    }

    _onRelatedElement(property: string, value: any, action: string) {
        let ev = new CustomEvent('related-element-action',
            { detail: { action, property: property, value: value } });
        window.dispatchEvent(ev);
    }

    _onDataChanged(property : string, valueAttribute ? : string) {
        let _valueAttribute = valueAttribute ? valueAttribute : 'value';
        let newValue = this.inputs[property][_valueAttribute];
        let ev = new CustomEvent('data-changed',
          { detail: { property: property, value: newValue} });
        window.dispatchEvent(ev);
      }
}