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
    CoordinateInput,
    AddressInput
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
import { PropsType as AddressPropsType } from "./components/Address";
import { ButtonSolid } from '../Button';
import { useForm, FormProvider, UseFormGetValues, FieldValues, FieldErrors, FieldError, UseFormReturn, useFieldArray } from 'react-hook-form';
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
    coordinateInput: CoordinateInput,
    addressInput: AddressInput

} as const;
type ItemTypes = ItemType<"text", TextInputPropsType> | ItemType<"radio", RadioButtonPropsType> |
    ItemType<"checkbox", RadioButtonPropsType> | ItemType<"radioGroup", RadioButtonGroupPropsType> |
    ItemType<"time", TimeFieldPropsType> | ItemType<"textarea", TextAreaPropsType> |
    ItemType<"select", SelectPropsType> | ItemType<"pillList", PillListPropsType> |
    ItemType<"pillGroup", PillListPropsType> | ItemType<"number", NumberInputPropsType> |
    ItemType<"range", RangePropsType> | ItemType<"checkboxGroup", CheckBoxGroupPropsType> |
    ItemType<"image", ImageUploadPropsType> | ItemType<"file", FileInputButtonPropsType> |
    ItemType<"coordinateInput", CoordinateInputPropsType> | ItemType<"addressInput", AddressPropsType>
type FormValueType = string | number | { [k: string]: string } | string[] | boolean
type TItemCommon = {
    title?: string,
    name: string,
    isOptional?: {    //field toggling for including optional fields
        title: string,
        default: boolean,// default value for whether the field should be visible or not.(Making field visible by default)
        sectionHeading?: string,//special title
    },
    wrapperClassName?: string,
    wrapperStyle?: React.CSSProperties,
    hidden?: boolean
}
type TSingleItem = {
    defaultValue?: FormValueType,
    wrapperRender?: (c: JSX.Element) => JSX.Element,
    isArray?: undefined,
    validationSchema?: yup.AnySchema,
} & ItemTypes
export type TArrayItem = {
    items: readonly (Extract<TItem, TItemCommon & TSingleItem> & { defaultValue: FormValueType })[],//form field component,
    defaultValue?: FormValueType[],
    wrapperRender?: (c: JSX.Element[]) => JSX.Element
    isArray: {   //dynamic field
        controlHeading: string //heading where + and - buttons are
        title: ((i: number) => string) | string,
        single?: boolean //constrict to single item. No + and - buttons
    },
}

type TItemDiscriminated = TSingleItem | TArrayItem;
type TItem = TItemCommon & TItemDiscriminated;
export interface SchemaType {
    heading: string,//Form heading
    items: readonly TItem[],
    submitButton: string | ((props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => JSX.Element),
    defaultValue?: object,
    wrapperClassName?: string,
    wrapperStyle?: React.CSSProperties,
}
export type FormDataShape<T extends DeepReadonly<SchemaType>> = { [k in T["items"][number]["name"]]: any }

function getInputComponent(item: Extract<TItem, TItemCommon & TSingleItem>) {
    let inputComponent!: any;
    Object.entries(componentMap).forEach(([type, component]) => {
        if (item.type === type) {
            inputComponent = component;
        }
    })
    return inputComponent;
}
function SingleComponent({ item, error, disabled }: { item: Extract<TItem, TItemCommon & TSingleItem>, error?: string, disabled?: boolean }) {
    React.useEffect(() => {
    }, [])
    const InputComponent = getInputComponent(item);

    return <div className={style["form-item"]}>
        {item.title && item.title !== "" &&
            <div className={style["form-item-heading"]}>
                {item.title}
            </div>
        }

        {
            item.wrapperRender ?
                item.wrapperRender(<InputComponent as any {...{ disabled, ...item.props, name: item.name }} />)
                :
                item.wrapperClassName || item.wrapperStyle ?
                    <div className={item.wrapperClassName ?? ""} style={item.wrapperStyle ?? {}}>
                        {
                            <InputComponent as any {...{ disabled, ...item.props, name: item.name }} />
                        }
                    </div>
                    :
                    <InputComponent as any {...{ disabled, ...item.props, name: item.name }} />
        }
        {
            error && <div className={style["field-error"]}>{error}</div>
        }
    </div>;
}
function ArrayComponent({ item, errors }: { item: Extract<TItem, TItemCommon & TArrayItem>, errors?: { [k: string]: FieldError }[], disabled?: boolean }) {
    const { fields, append, remove } = useFieldArray({ name: item.name });
    React.useEffect(() => {
        if (item.defaultValue) {
            append(item.defaultValue);
            //item.defaultValue.forEach(e => {
            //    append(e);
            //    console.log(e);
            //})
        }
        if (item.isArray.single) {
            append(defValues);
        }
    }, [])
    const setCountRef = React.useRef<(v: number) => void>(() => { });
    const defValues = item.items.reduce((obj, curr) => { return { ...obj, [curr.name]: curr.defaultValue } }, {});
    const itemList = React.useCallback((i: number) => item.items.map((_item, k) => <React.Fragment key={k}>{
        <SingleComponent
            item={{
                ..._item, name: `${item.name}[${i}].${_item.name}`,
                wrapperStyle: { minHeight: "3.5em", display: "flex", alignItems: "center" }
            }}
            error={errors?.[i]?.[_item.name]?.message} />
    }</React.Fragment>
    ), [item]);
    return <React.Fragment>
        {!item.isArray.single &&
            <div className={`${style["form-item"]} ${style["paper"]} ${style["center"]} ${style["fit"]} ${style["col1"]}`}>
                <div className={style["form-item-heading"]}>
                    {item.isArray.controlHeading}
                </div>
                <NumberInput
                    name={item.name + "_count"}
                    onIncrement={(v) => {
                        append(defValues);
                    }}
                    init={item.defaultValue?.length}
                    disabledBtn={[0]}
                    setValueRef={setCountRef}
                />
            </div>
        }
        <div className={`${style["form-item"]}`}>
            {
                fields.map((e, i) => {
                    return <div key={e.id} className={style["form-item"]}>
                        <div className={style["horizontal-list"]}>
                            <div className={item.isArray.single ? style["form-item-heading"] : ""}>
                                {typeof item.isArray.title === "string" ?
                                    item.isArray.title :
                                    item.isArray.title(i + 1)
                                }
                            </div>
                            {!item.isArray.single &&
                                < button type="button" className={style["remove-btn"]}
                                    onClick={() => {
                                        setCountRef.current(fields.length - 1);
                                        remove(i);
                                    }}
                                >
                                    <i className="fas fa-minus" /></button>
                            }
                        </div>
                        {
                            item.wrapperRender ?
                                item.wrapperRender(itemList(i))
                                :
                                <div className={item.wrapperClassName ?? !item.wrapperStyle ? style["horizontal-list"] : ""} style={item.wrapperStyle ?? {}}>
                                    {
                                        itemList(i)
                                    }
                                </div>
                        }
                    </div>
                })
            }
        </div>
    </React.Fragment >
}
function FormComponent({ item, errors, disabled }: { item: TItem, errors?: FieldErrors, disabled?: boolean }) {
    if (item.isArray)
        return <ArrayComponent disabled={disabled} item={item} errors={errors?.[item.name]} />
    else
        return <SingleComponent disabled={disabled} item={item} error={errors?.[item.name]?.message} />
}

function ToggleWrapper({ name, optionalProps, itemComponent }: { name: string, optionalProps: Exclude<TItem['isOptional'], undefined>, itemComponent: JSX.Element }) {
    const [open, setOpen] = React.useState<boolean>(optionalProps.default);
    return (
        <div>
            <div className={style["form-item"]} >
                <div className={style["horizontal-list"]}>
                    <CheckBox
                        name={name + "_provided"}
                        defaultChecked={optionalProps.default}
                        onChange={(e) => setOpen(e.target.checked)}
                    >
                        <div className={style["form-item-heading"]}>
                            {optionalProps.title}
                        </div>
                    </CheckBox>
                </div>
            </div>
            {
                open && <div className={style["form-item"]}>
                    <br />
                    {optionalProps.sectionHeading && <div className={style["form-section-heading"]}>
                        {optionalProps.sectionHeading}
                    </div>}
                    {
                        itemComponent
                    }
                </div>
            }
        </div>
    )
}

function Generate({ schema, errors, disabled }: { schema: SchemaType, errors: { [K: string]: any }, disabled?: boolean }) {
    return <>{schema.items.map((item, i) => {
        return <React.Fragment key={i}>
            {item.hidden ? <></> :
                <>
                    {
                        item.isOptional ?
                            <ToggleWrapper name={item.name}
                                optionalProps={item.isOptional}
                                itemComponent={<FormComponent item={item} errors={errors} disabled={disabled} />}
                            />
                            :
                            <FormComponent item={item} errors={errors} disabled={disabled} />
                    }
                </>
            }
        </React.Fragment>
    })
    }
    </>
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
export type PropsType = {
    schema: SchemaType,
    onSubmit: (data: any) => void,
    onError?: (e: any) => void,
    disabled?: boolean,
}
export default function FormGenerator({ schema, onSubmit, onError, disabled }: PropsType) {
    const yupSchema = generateYupSchema(schema.items);
    const methods = useForm({ resolver: yupResolver(yupSchema, { abortEarly: false }) });
    const handleSubmit = methods.handleSubmit(onSubmit, onError);
    const errors = methods.formState.errors;
    return (
        <FormProvider {...methods}>
            {
                schema.heading && <div className={style["form-header"]}>
                    {schema.heading}
                </div>
            }
            <form className={schema.wrapperClassName ?? !schema.wrapperStyle ? style["form-container"] : ""} style={schema.wrapperStyle} onSubmit={e => { e.preventDefault(); handleSubmit() }}>

                {
                    <Generate schema={schema} errors={errors} disabled={disabled}
                    />
                }
                {
                    typeof schema.submitButton === "string" ?
                        <ButtonSolid className={style["form-submit-btn"]} disabled={disabled}>{schema.submitButton}</ButtonSolid>
                        :
                        schema.submitButton({ disabled })

                }
            </form>
        </FormProvider>

    )
}
