interface Schema {
    jsonSchema : JsonSchema;
    uiSchema : Object;
    actions : Object;
}

interface JsonSchema {
    properties : Array<Object>;
}