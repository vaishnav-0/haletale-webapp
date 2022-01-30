import React from 'react';
import ReactSlider from 'react-slider'
import './Range.scss';
export type PropType = {
    renderThumb?: (state: { value: number | number[], index: number, valueNow: number }) => void
    max?: number,
    min?: number,
    step?: number,
    onChange?: (v: number[] | number) => void,
    defaultValue?: number | number[]
}
export function Range({ renderThumb = () => { }, max = 100, min = 0, step = 1, defaultValue, onChange }: PropType): JSX.Element {
    return <ReactSlider
        className="range-slider"
        max={max}
        min={min}
        onChange={onChange}
        thumbClassName="Range-thumb-style"
        trackClassName="Range-track-style"
        defaultValue={defaultValue}
        ariaLabel={['Lower limit', 'Upper limit']}
        ariaValuetext={(state: any) => `Thumb value ${state.valueNow}`}
        renderThumb={(props: any, state) => <div {...props}>
            {renderThumb(state)}
        </div>}
        pearling
        minDistance={10}
        step={step}

    />
}
