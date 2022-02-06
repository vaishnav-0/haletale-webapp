import React from "react";
import { useFieldArray, UseFieldArrayProps, UseFieldArrayReturn } from "react-hook-form";

export default function FieldArrayWrapper({ children = null, ...props }: UseFieldArrayProps & { children?: null|((props: UseFieldArrayReturn) => JSX.Element) }) {
    const fieldArrayRet = useFieldArray(props);
    return children && children(fieldArrayRet);
}