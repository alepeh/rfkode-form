import { h } from '@stencil/core';

export class AdvancedWidgetFactory implements Factory {

    inputs: any = {};

    produceWidget(schema: Schema, property: string, data: any) {
        console.log(schema);
        console.log(property);
        console.log(data);
        const widgetType = this._getWidgetType(schema, property);
        switch (widgetType) {
            case ("selectRelated"): return this.selectRelatedWidget(property, Array(data));
            case ("selectMultipleRelated"): return this.selectRelatedWidget(property, data, true);
            case ("textarea"): return this.textAreaWidget(property, data);
            default: return this.unsupportedWidget(property, data);
        }
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

    selectRelatedWidget(property: string, data: Array<string>, multiple?: boolean) {
        console.log(multiple);
        return (
            <ion-list>
                <ion-list-header>
                    <ion-label>{property}</ion-label>
                    <ion-button disabled={!multiple}>+</ion-button>
                </ion-list-header>
                {data ? data.map(item => {
                    return (
                        <ion-item detail>
                            <ion-label onClick={() => this._onRelatedElement(property, item, "view")}>{item}</ion-label>
                            <ion-button onClick={() => this._onRelatedElement(property, item, "edit")} slot="end">Change</ion-button>
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