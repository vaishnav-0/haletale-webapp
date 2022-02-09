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
} from './index';
import { PropsType as RadioButtonPropsType } from "./components/ToggleButtons";
import { PropsType as TextInputPropsType } from "./components/TextInput";
import { PropsType as RadioButtonGroupPropsType } from "./components/RadiobuttonGroup";
import { PropsType as TimeFieldPropsType } from "./components/TimeField";
import { PropsType as TextAreaPropsType } from "./components/TextArea";
import { PropsType as SelectPropsType } from "./components/Select";
import { PropsType as PillListPropsType } from "./components/PillList";
import { PropsType as NumberInputPropsType } from "./components/NumberInput";
import { PropType as RangePropsType } from "./components/Range";
import { FileInputButtonPropsType } from "./components/FileInputButton";
import { PropsType as ImageUploadPropsType } from "./components/Images";
import { ButtonSolid } from '../Button';
import { useForm, FormProvider } from 'react-hook-form';
import FieldArrayWrapper from './FieldArrayWrapper';

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
    image: ImageUpload
}
type ItemTypes = ItemType<"text", TextInputPropsType> | ItemType<"radio", RadioButtonPropsType> |
    ItemType<"checkbox", RadioButtonPropsType> | ItemType<"radioGroup", RadioButtonGroupPropsType> |
    ItemType<"time", TimeFieldPropsType> | ItemType<"textarea", TextAreaPropsType> |
    ItemType<"select", SelectPropsType> | ItemType<"pillList", PillListPropsType> |
    ItemType<"pillGroup", PillListPropsType> | ItemType<"number", NumberInputPropsType> |
    ItemType<"range", RangePropsType> |
    ItemType<"image", ImageUploadPropsType> | ItemType<"file", FileInputButtonPropsType>
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
    isArray?: false
} & ItemTypes
type TArrayItem = {
    items: (Extract<TItem, TItemCommon & TSingleItem> & { defaultValue: FormValueType })[],//form field component,
    defaultValue?: FormValueType[],
    isArray: {   //dynamic field
        controlHeading: string //heading where + and - buttons are
        title: ((i: number) => string) | string,
        sectionHeading?: string
    }
}

type TItemDiscriminated = TSingleItem | TArrayItem;
type TItem = TItemCommon & TItemDiscriminated;
export interface SchemaType {
    heading: string,//Form heading
    items: TItem[],
    validationSchema?: any,
    submitButton: string | (() => JSX.Element),
    onSubmit: (data: any) => void
}
function getInputComponent(item: Extract<TItem, TItemCommon & TSingleItem>) {
    let inputComponent!: JSX.Element;
    if (item.type === 'text') {
        let Component = componentMap[item.type];
        inputComponent = <Component {...{ ...item.props, name: item.name }} />
    }
    else if (item.type === 'radio') {
        let Component = componentMap[item.type];
        inputComponent = <Component {...{ ...item.props, name: item.name }} />
    }
    else if (item.type === 'checkbox') {
        let Component = componentMap[item.type];
        inputComponent = <Component {...{ ...item.props, name: item.name }} />
    }
    else if (item.type === 'radioGroup') {
        let Component = componentMap[item.type];
        inputComponent = <Component {...{ ...item.props, name: item.name }} />
    }
    else if (item.type === 'time') {
        let Component = componentMap[item.type];
        inputComponent = <Component {...{ ...item.props, name: item.name }} />
    }
    else if (item.type === 'textarea') {
        let Component = componentMap[item.type];
        inputComponent = <Component {...{ ...item.props, name: item.name }} />
    }
    else if (item.type === 'select') {
        let Component = componentMap[item.type];
        inputComponent = <Component {...{ ...item.props, name: item.name }} />
    }
    else if (item.type === 'pillList') {
        let Component = componentMap[item.type];
        inputComponent = <Component {...{ ...item.props, name: item.name }} />
    }
    else if (item.type === 'pillGroup') {
        let Component = componentMap[item.type];
        inputComponent = <Component {...{ ...item.props, name: item.name }} />
    }
    else if (item.type === 'number') {
        let Component = componentMap[item.type];
        inputComponent = <Component {...{ ...item.props, name: item.name }} />
    }
    else if (item.type === 'range') {
        let Component = componentMap[item.type];
        inputComponent = <Component {...{ ...item.props, name: item.name }} />
    }
    else if (item.type === 'file') {
        let Component = componentMap[item.type];
        inputComponent = <Component {...{ ...item.props, name: item.name }} />
    }
    else if (item.type === 'image') {
        let Component = componentMap[item.type];
        inputComponent = <Component {...{ ...item.props, name: item.name }} />
    }
    return inputComponent;
}
function SingleComponent(item: Extract<TItem, TItemCommon & TSingleItem>) {
    const inputComponent = getInputComponent(item);
    return <div className={style["form-item"]}>
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
    </div>;
}
function ArrayComponent(item: Extract<TItem, TItemCommon & TArrayItem>) {
    const setCountRef = React.useRef<(v: number) => void>(() => { });
    const defValues = item.items.reduce((obj, curr) => { return { ...obj, [curr.name]: curr.defaultValue } }, {});
    return <>
        <FieldArrayWrapper name={item.name}>
            {({ fields, append, remove }) => <>

                <div className={`${style["form-item"]} ${style["paper"]} ${style["center"]} ${style["fit"]} ${style["col1"]}`}>
                    <div className={style["form-item-heading"]}>
                        {item.isArray.controlHeading}
                    </div>
                    <NumberInput
                        name={item.name + "_count"}
                        onIncrement={(v) => {
                            console.log(defValues);
                            append(defValues);
                        }}
                        disabled={[0]}
                        setValueRef={setCountRef}
                    />
                </div>
                <div className={`${style["form-item"]}`}>
                    {
                        fields.map((e, i) => {
                            console.log(e);
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
                                            console.log("clicked");
                                            setCountRef.current(fields.length - 1);
                                            remove(i);
                                        }}
                                    >
                                        <i className="fas fa-minus" /></button>
                                </div>
                                <div className={style["horizontal-list"]}>
                                    {
                                        item.items.map((_item, k) => <div key={k}>{getInputComponent({ ..._item, name: `${item.name}[${i}].${_item.name}` })}</div>)
                                    }
                                </div>
                            </div>
                        })
                    }
                </div>
            </>

            }
        </FieldArrayWrapper>
    </>
}
function FormComponent(item: TItem) {
    if (item.isArray)
        return ArrayComponent(item);
    else
        return SingleComponent(item);
}
function ToggleWrapper(name: string, optionalProps: Exclude<TItem['isOptional'], undefined>, itemComponent: JSX.Element) {
    const [open, setOpen] = React.useState<boolean>(optionalProps.default);
    return (
        <>
            <div className={style["form-item"]}>
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
        </>
    )
}

export default function FormGenerator({ schema }: { schema: SchemaType }) {
    const methods = useForm();
    const handleSubmit = methods.handleSubmit(schema.onSubmit, d => console.log(d));
    return (
        <FormProvider {...methods}>
            <form className={style["form-container"]} onSubmit={e => { e.preventDefault(); handleSubmit() }}>
                <div className={style["form-header"]}>
                    {schema.heading}
                </div>
                {
                    schema.items.map(item => {
                        return item.isOptional ?
                            ToggleWrapper(item.name, item.isOptional, FormComponent(item)) :
                            FormComponent(item);
                    })
                }
                {
                    typeof schema.submitButton === "string" ?
                        <ButtonSolid className={style["form-submit-btn"]} >{schema.submitButton}</ButtonSolid>
                        :
                        schema.submitButton()

                }
            </form>
        </FormProvider>
    )
}
