import { h } from '@stencil/core';

export class BasicWidgetFactory implements Factory {
    
    inputs: any = {};

    produceWidget(schema: Schema, property: any, data: string) {
        return (
            <ion-item>
              <ion-label position="stacked">{property}</ion-label>
              <ion-input onIonInput={() => this._onDataChanged(property)}
                type="text" id={property} value={data}
                ref={(el) => this.inputs[property] = el}  
              ></ion-input>
            </ion-item>
            )
    }

    _onDataChanged(property){
        let newValue = this.inputs[property].value;
        let ev = new CustomEvent('data-changed', 
            { detail : { property : property,  value : newValue}});
        window.dispatchEvent(ev);
    }

}