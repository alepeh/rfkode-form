import { BasicWidgetFactory } from './basicWidgetFactory';
import { AdvancedWidgetFactory } from './advancedWidgetFactory';

export class WidgetFactory {

    produceWidget(schema: Schema, property, data){
        if(! schema || ! schema.uiSchema || ! schema.uiSchema[property]){
            console.log("Basic widget");
            return new BasicWidgetFactory().produceWidget(schema, property, data);
        }
        if(schema && schema.uiSchema && schema.uiSchema[property]){
            return new AdvancedWidgetFactory().produceWidget(schema, property, data);
        }
    }
}
export let widgetFactory = new WidgetFactory();