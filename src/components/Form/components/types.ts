import { FieldInputProps } from "formik";

export interface InputPropsType extends FieldInputProps<any>, Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "name" | "onBlur" | "onChange" | "value"> { }

export type ExcludeFieldInput<T> = Omit<T, keyof FieldInputProps<any>> & { name: string, value: any };