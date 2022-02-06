import React from "react";
import { useFormContext, Controller } from "react-hook-form";
export type NativeWrapperComponentType<T> = React.JSXElementConstructor<T & { ref: React.Ref<any> | undefined }>;
export type CustomWrapperComponentType<T> = React.JSXElementConstructor<T>;

export function NativeWrapper<ComponentPropType extends { name: string }>({ Component, props }:
    {
        Component: NativeWrapperComponentType<ComponentPropType>,
        props: ComponentPropType,
        custom?: boolean
    }): JSX.Element {
    const formContext = useFormContext();
    if (!formContext)
        throw new Error("No form context found.")
    const pr = { ...formContext.register(props.name), ...props }
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
    return (
        <Controller
            name={props.name}
            render={({ field: { onChange, onBlur } }) => <Component {...{ onChange, onBlur, ...props }} />
            }
        />
    );
}


