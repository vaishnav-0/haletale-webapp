import React from "react";
import { InputPropsType } from "./components/types";
import { NativeWrapperComponentType, CustomWrapperComponentType } from "./formWrap";
import { RadioButton as RadioButton_, PropsType as RadioButtonPropsType, CheckBox as CheckBox_, PropsType } from "./components/ToggleButtons";
import { TextInput as TextInput_, PropsType as TextInputPropsType } from "./components/TextInput";
import { default as RadioButtonGroup_, PropsType as RadioButtonGroupPropsType } from "./components/RadiobuttonGroup";
import { TimeField as TimeField_, PropsType as TimeFieldPropsType } from "./components/TimeField";
import { TextArea as TextArea_, PropsType as TextAreaPropsType } from "./components/TextArea";
import { Select as Select_, PropsType as SelectPropsType } from "./components/Select";
import { PillList as PillList_, PropsType as PillListPropsType } from "./components/PillList";
import { NumberInput as NumberInput_, PropsType as NumberInputPropsType } from "./components/NumberInput";
import { Range as Range_, PropType as RangePropsType } from "./components/Range";
import { FileInputButton as FileInputButton_, FileInputButtonPropsType } from "./components/FileInputButton";
import { ImageUpload as ImageUpload_, PropsType as ImageUploadPropsType } from "./components/Images";
import { NativeWrapper, CustomWrapper } from "./formWrap";

function wrappedGen<T extends { name: string }>(c: NativeWrapperComponentType<T> | CustomWrapperComponentType<T>, custom?: boolean) {
    return function (p: T) {
        if (custom)
            return <CustomWrapper<T> Component={c as CustomWrapperComponentType<T>} props={p} />
        return <NativeWrapper<T> Component={c} props={p} />
    }
}

export const RadioButton = wrappedGen<RadioButtonPropsType>(RadioButton_);
export const CheckBox = wrappedGen<RadioButtonPropsType>(CheckBox_);
export const TextInput = wrappedGen<TextInputPropsType>(TextInput_);
export const RadioButtonGroup = wrappedGen<RadioButtonGroupPropsType>(RadioButtonGroup_);
export const TimeField = wrappedGen<TimeFieldPropsType>(TimeField_);
export const TextArea = wrappedGen<TextAreaPropsType>(TextArea_);
export const Select = wrappedGen<SelectPropsType>(Select_);
export const FileInputButton = wrappedGen<FileInputButtonPropsType>(FileInputButton_);

export const PillList = wrappedGen<PillListPropsType & { name: string }>(PillList_, true);
export const NumberInput = wrappedGen<NumberInputPropsType & { name: string }>(NumberInput_, true);
export const Range = wrappedGen<RangePropsType & { name: string }>(Range_, true);
export const ImageUpload = wrappedGen<ImageUploadPropsType & { name: string }>(ImageUpload_, true);


