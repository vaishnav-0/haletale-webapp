import React from "react";
import style from './Form.module.scss';
import {
    RadioButton,
    CheckBox,
    TextInput,
    RadioButtonGroup,
    TimeField,
    TextArea,
    Select,
    FileInputButton,
    PillList,
    PillGroup,
    NumberInput,
    Range,
    ImageUpload,
    CheckBoxGroup,
    CoordinateInput
} from './index';
import { PropsType as CoordinateInputPropsType } from "./components/CoordinateInput";
import { PropsType as RadioButtonPropsType } from "./components/ToggleButtons";
import { PropsType as TextInputPropsType } from "./components/TextInput";
import { RadioButtonGroupPropsType, CheckBoxGroupPropsType } from "./components/RadiobuttonGroup";
import { PropsType as TimeFieldPropsType } from "./components/TimeField";
import { PropsType as TextAreaPropsType } from "./components/TextArea";
import { PropsType as SelectPropsType } from "./components/Select";
import { PropsType as PillListPropsType } from "./components/PillList";
import { PropsType as NumberInputPropsType } from "./components/NumberInput";
import { PropType as RangePropsType } from "./components/Range";
import { FileInputButtonPropsType } from "./components/FileInputButton";
import { PropsType as ImageUploadPropsType } from "./components/Images";
import { ButtonSolid } from '../Button';
import { useForm, FormProvider, UseFormGetValues, FieldValues, FieldErrors, FieldError, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FieldArrayWrapper from './FieldArrayWrapper';
import { DeepReadonly } from '../../types/utilTypes'
import * as yup from 'yup';




type ItemType<T, P> = {
    type: T,
    props: Omit<P, "name">
}

const componentMap = {
    text: TextInput,
    radio: RadioButton,
    checkbox: CheckBox,
    radioGroup: RadioButtonGroup,
    time: TimeField,
    textarea: TextArea,
    select: Select,
    pillList: PillList,
    pillGroup: PillGroup,
    number: NumberInput,
    range: Range,
    file: FileInputButton,
    image: ImageUpload,
    checkboxGroup: CheckBoxGroup,
    coordinateInput: CoordinateInput
} as const;
type ItemTypes = ItemType<"text", TextInputPropsType> | ItemType<"radio", RadioButtonPropsType> |
    ItemType<"checkbox", RadioButtonPropsType> | ItemType<"radioGroup", RadioButtonGroupPropsType> |
    ItemType<"time", TimeFieldPropsType> | ItemType<"textarea", TextAreaPropsType> |
    ItemType<"select", SelectPropsType> | ItemType<"pillList", PillListPropsType> |
    ItemType<"pillGroup", PillListPropsType> | ItemType<"number", NumberInputPropsType> |
    ItemType<"range", RangePropsType> | ItemType<"checkboxGroup", CheckBoxGroupPropsType> |
    ItemType<"image", ImageUploadPropsType> | ItemType<"file", FileInputButtonPropsType> |
    ItemType<"coordinateInput", CoordinateInputPropsType> | { type: "custom", render: (f: UseFormReturn) => JSX.Element }
type FormValueType = string | number | { [k: string]: string } | string[] | boolean
type TItemCommon = {
    title?: string,
    name: string,
    isOptional?: {    //field toggling
        title: string,
        value: [string, string];
        default: boolean,
        sectionHeading?: string,
    }
}
type TSingleItem = {
    wrapperRender?: (c: JSX.Element) => JSX.Element
    wrapperClassname?: string,
    wrapperStyle?: React.CSSProperties,
    defaultValue?: FormValueType,
    isArray?: undefined,
    validationSchema?: yup.AnySchema,
} & ItemTypes
type TArrayItem = {
    items: readonly (Extract<TItem, TItemCommon & TSingleItem> & { defaultValue: FormValueType })[],//form field component,
    defaultValue?: FormValueType[],
    isArray: {   //dynamic field
        controlHeading: string //heading where + and - buttons are
        title: ((i: number) => string) | string,
        sectionHeading?: string
    },
}

type TItemDiscriminated = TSingleItem | TArrayItem;
type TItem = TItemCommon & TItemDiscriminated;
export interface SchemaType {
    heading: string,//Form heading
    items: readonly TItem[],
    submitButton: string | ((getData: UseFormGetValues<FieldValues>) => JSX.Element),
}
export type FormDataShape<T extends DeepReadonly<SchemaType>> = { [k in T["items"][number]["name"]]: any }

function generateFields(schema: SchemaType, errors: FieldErrors, useFormRet: UseFormReturn) {
    function getInputComponent(item: Extract<TItem, TItemCommon & TSingleItem>) {
        let inputComponent!: JSX.Element;
        if (item.type === "custom") {
            return item.render(useFormRet);
        }
        Object.entries(componentMap).forEach(([type, component]) => {
            if (item.type === type) {
                let Component = component as any;
                inputComponent = <Component as any {...{ ...item.props, name: item.name }} />
            }
        })
        return inputComponent;
    }
    function SingleComponent(item: Extract<TItem, TItemCommon & TSingleItem>, error?: string) {
        const inputComponent = getInputComponent(item);
        return <div key={keyGen.next().value} className={style["form-item"]}>
            <div className={style["form-item-heading"]}>
                {item.title}
            </div>
            {
                item.wrapperRender ?
                    item.wrapperRender(inputComponent)
                    :
                    <div className={item.wrapperClassname ?? ""} style={item.wrapperStyle ?? {}}>
                        {
                            inputComponent
                        }
                    </div>
            }
            {
                error && <div className={style["field-error"]}>{error}</div>
            }
        </div>;
    }
    function ArrayComponent(item: Extract<TItem, TItemCommon & TArrayItem>, errors?: { [k: string]: FieldError }[]) {
        const setCountRef = React.useRef<(v: number) => void>(() => { });
        const defValues = item.items.reduce((obj, curr) => { return { ...obj, [curr.name]: curr.defaultValue } }, {});
        return <div key={keyGen.next().value}>
            <FieldArrayWrapper name={item.name} >
                {({ fields, append, remove }) => <>
                    <div className={`${style["form-item"]} ${style["paper"]} ${style["center"]} ${style["fit"]} ${style["col1"]}`}>
                        <div className={style["form-item-heading"]}>
                            {item.isArray.controlHeading}
                        </div>
                        <NumberInput
                            name={item.name + "_count"}
                            onIncrement={(v) => {
                                append(defValues);
                            }}
                            disabled={[0]}
                            setValueRef={setCountRef}
                        />
                    </div>
                    <div className={`${style["form-item"]}`}>
                        {
                            fields.map((e, i) => {
                                return <div key={e.id} className={style["form-item"]}>
                                    <div className={style["horizontal-list"]}>
                                        <div>
                                            {typeof item.isArray.title === "string" ?
                                                item.isArray.title + " " + (i + 1) :
                                                item.isArray.title(i + 1)
                                            }
                                        </div>
                                        <button type="button" className={style["remove-btn"]}
                                            onClick={() => {
                                                setCountRef.current(fields.length - 1);
                                                remove(i);
                                            }}
                                        >
                                            <i className="fas fa-minus" /></button>
                                    </div>
                                    <div className={style["horizontal-list"]} style={{ alignItems: "start" }}>
                                        {
                                            item.items.map((_item, k) => <div key={k}>{
                                                SingleComponent(
                                                    {
                                                        ..._item, name: `${item.name}[${i}].${_item.name}`,
                                                        wrapperStyle: { minHeight: "3.5em", display: "flex", alignItems: "center" }
                                                    },
                                                    errors?.[i]?.[_item.name]?.message)
                                            }</div>)
                                        }
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </>

                }
            </FieldArrayWrapper>
        </div>
    }
    function FormComponent(item: TItem, errors?: FieldErrors) {
        if (item.isArray)
            return ArrayComponent(item, errors?.[item.name]);
        else
            return SingleComponent(item, errors?.[item.name]?.message);
    }

    function ToggleWrapper(name: string, optionalProps: Exclude<TItem['isOptional'], undefined>, itemComponent: JSX.Element) {
        const [open, setOpen] = React.useState<boolean>(optionalProps.default);
        return (
            <div key={keyGen.next().value}>
                <div className={style["form-item"]} >
                    <div className={style["form-item-heading"]}>
                        {optionalProps.title}
                    </div>
                    <div className={style["horizontal-list"]}>
                        <RadioButtonGroup
                            name={name + "Provided"}
                            values={optionalProps.value}
                            defaultValue={optionalProps.value[+!optionalProps.default]}
                            onChange={(e) => setOpen(e.target.value === optionalProps.value[0])}
                        />
                    </div>
                </div>
                {
                    open && <>
                        {optionalProps.sectionHeading && <div className={style["form-section-heading"]}>
                            {optionalProps.sectionHeading}
                        </div>}
                        {
                            itemComponent
                        }
                    </>
                }
            </div>
        )
    }
    const keyGen = (function* () {
        let index = 0;
        while (true) {
            yield index++;
        }
    })();
    return schema.items.map(item => {
        return item.isOptional ?
            ToggleWrapper(item.name, item.isOptional, FormComponent(item, errors)) :
            FormComponent(item, errors);
    })
}

function generateYupSchema(items: readonly TItem[]) {
    return yup.object(
        items.reduce((schema, item) => {
            if (!item.isArray)
                item.validationSchema && (schema[item.name] = item.validationSchema);
            else
                schema[item.name] = yup.array().of(generateYupSchema(item.items))
            return schema;
        }, {} as any)
    )
}

export default function FormGenerator({ schema, onSubmit, onError }: {
    schema: SchemaType, onSubmit: (data: any) => void,
    onError?: (e: any) => void,
}) {
    const yupSchema = generateYupSchema(schema.items);
    const methods = useForm({ resolver: yupResolver(yupSchema) });
    const handleSubmit = methods.handleSubmit(onSubmit, onError);
    const errors = methods.formState.errors;
    return (
        <FormProvider {...methods}>
            <form className={style["form-container"]} onSubmit={e => { e.preventDefault(); handleSubmit() }}>
                {
                    schema.heading && <div className={style["form-header"]}>
                        {schema.heading}
                    </div>
                }
                {
                    generateFields(schema, errors, methods)
                }
                {
                    typeof schema.submitButton === "string" ?
                        <ButtonSolid className={style["form-submit-btn"]} >{schema.submitButton}</ButtonSolid>
                        :
                        schema.submitButton(methods.getValues)

                }
            </form>
        </FormProvider>
    )
}
