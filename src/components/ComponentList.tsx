import React from "react";
import useListState, { useListStateReturnType } from "../functions/hooks/useListState";
type PropsType<T> = {
  children?: ((args: useListStateReturnType<T>) => JSX.Element) | null
}
export function ComponentList<T>({ children = null }: PropsType<T>) {
  const state = useListState<T>([]);
  return children && children(state);
}
