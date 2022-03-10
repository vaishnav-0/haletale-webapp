
import { SchemaType } from "./FormGenerator";
import cloneDeep from 'clone-deep';
export type dataMapReturn = { [k: string]: ((item: SchemaType["items"][number]) => void) | dataMapReturn };
function getItem(items: SchemaType["items"], name: string) {
    if (name === "*")
        return name;
    for (let i = 0; i < items.length; i++)
        if (items[i].name == name)
            return items[i];
    throw new Error("item " + name + " not found");
}
function getArrayItems(items: SchemaType["items"]) {
    return items.filter(item => !!item.isArray);
}
function applyToAll(items: SchemaType["items"], fn: (item: SchemaType["items"][number]) => void) {
    for (let i = 0; i < items.length; i++) {
        fn(items[i]);
    }
}
function modifySchema(dataMap: dataMapReturn, items: SchemaType["items"]) {
    const dataMapEntries = Object.entries(dataMap);
    for (let i = 0; i < dataMapEntries.length; i++) {
        const [key, fn] = dataMapEntries[i];
        const schemaItem = getItem(items, key);
        if (typeof fn === 'function') {
            if (schemaItem === "*") {
                applyToAll(items, fn);
            }
            else
                fn(schemaItem)
        }
        else {
            if (schemaItem === "*")
                modifySchema(fn, getArrayItems(items))
            else
                if (schemaItem.isArray) {
                    modifySchema(fn, schemaItem.items)
                }
                else
                    throw new Error("invalid structure for given schema")

        }
    }
}
export async function dynamicSchemaGenerator({ schema, dataLoader, dataMap }:
    { schema: SchemaType, dataLoader?: any, dataMap: (d?: any) => dataMapReturn }) {
    const _schema: SchemaType = cloneDeep(schema);
    const data = await dataLoader;
    const dataMaped = dataMap(data);
    modifySchema(dataMaped, _schema.items);
    return _schema;
}
export async function defaultValueInjector(schema: SchemaType, defaultValue: any) {
    const _schema: SchemaType = cloneDeep(schema);
    return dynamicSchemaGenerator({
        schema: _schema,
        dataLoader: defaultValue,
        dataMap: (data) => {
            return {
                "*": (item: any) => {
                    if (data[item.name]) {
                        if (item.isArray) {
                            item.defaultValue = data[item.name]
                        }
                        else if (item.props)
                            item.props.defaultValue = data[item.name]
                    }

                }
            }
        }
    });

}