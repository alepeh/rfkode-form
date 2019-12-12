import { BasicWidgetFactory } from './basicWidgetFactory';

export class WidgetFactory {

    produceWidget(schema: Schema, property, data){
        if(! schema || ! schema.uiSchema){
            return new BasicWidgetFactory().produceWidget(schema, property, data);
        }
    }
}
export let widgetFactory = new WidgetFactory();