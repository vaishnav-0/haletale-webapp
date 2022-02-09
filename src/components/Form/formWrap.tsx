import React from "react";
import { useFormContext, Controller } from "react-hook-form";
export type NativeWrapperComponentType<T> = React.JSXElementConstructor<T & { ref: React.Ref<any> | undefined }>;
export type CustomWrapperComponentType<T> = React.JSXElementConstructor<T>;
function groupOptionalCalls(fn1: (v: any) => void, fn2?: Function): (v: any) => void {
    return typeof fn2 === "function" ? (v: any) => {
        fn1(v);
        fn2(v);
    }
        :
        fn1;
}
export function NativeWrapper<ComponentPropType extends { name: string }>({ Component, props }:
    {
        Component: NativeWrapperComponentType<ComponentPropType>,
        props: ComponentPropType,
        custom?: boolean
    }): JSX.Element {
    const formContext = useFormContext();
    if (!formContext)
        throw new Error("No form context found.");
    const { onChange, onBlur, ...registerRest } = formContext.register(props.name);
    const { onChange: propOnChange, onBlur: PropOnBlur, ...propsRest } = props as any;
    const pr = {
        ...registerRest, ...propsRest, onChange: groupOptionalCalls(onChange, propOnChange),
        onBlur: groupOptionalCalls(onBlur, PropOnBlur)
    }
    return (
        <Component {...pr} />
    );
}
export function CustomWrapper<ComponentPropType extends { name: string }>({ Component, props }:
    {
        Component: CustomWrapperComponentType<ComponentPropType>,
        props: ComponentPropType,
    }): JSX.Element {
    const formContext = useFormContext();

    if (!formContext)
        throw new Error("No form context found.");
    const { onChange: propOnChange, onBlur: PropOnBlur, ...propsRest } = props as any;
    return (
        <Controller
            name={props.name}
            render={({ field: { onChange, onBlur } }) => <Component {...{
                onChange: groupOptionalCalls(onChange, propOnChange),
                onBlur: groupOptionalCalls(onBlur, PropOnBlur), ...propsRest
            }} />
            }
        />
    );
}


