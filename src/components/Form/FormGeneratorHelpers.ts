
import { SchemaType } from "./FormGenerator";
import cloneDeep from 'clone-deep';
export type dataMapReturn = { [k: string]: ((item: SchemaType["items"][number]) => void) | dataMapReturn }[];
function getItem(items: SchemaType["items"], name: string) {
    for (let i = 0; i < items.length; i++)
        if (items[i].name == name)
            return items[i];
    throw new Error("item not found");
}
function modifySchema(dataMap: dataMapReturn, schema: { items: SchemaType["items"] }) {
    for (let i = 0; i < dataMap.length; i++) {
        const dataMapItem = dataMap[i];
        const [key, fn] = Object.entries(dataMapItem)[0];
        const schemaItem = getItem(schema.items, key);
        if (typeof fn === 'function')
            fn(schemaItem)
        else
            if (schemaItem.isArray)
                modifySchema(fn, schemaItem)
            else
                throw new Error("invalid structure for given schema")
    }
}
export async function dynamicSchemaGenerator({ schema, dataLoader, dataMap }:
    { schema: SchemaType, dataLoader: () => Promise<any>, dataMap: (d: any) => dataMapReturn }) {
    const _schema: SchemaType = cloneDeep(schema);
    const data = await dataLoader();
    const dataMaped = dataMap(data);
    modifySchema(dataMaped, _schema);
    return _schema;
}   