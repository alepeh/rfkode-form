import { Schema } from '../components/form/form';

export interface Factory {
    produceWidget(schema : Schema, property : String, data : Object) : any;

}