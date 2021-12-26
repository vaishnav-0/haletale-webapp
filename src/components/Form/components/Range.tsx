import React from 'react';
import ReactSlider from 'react-slider'
import './Range.scss';
type prop = {
    renderThumb?: (state: { value: number | number[], index: number, valueNow: number }) => void
    max?: number,
    min?: number,
    step?: number,
    defaultValue?: number | number[]
}
export default function ({ renderThumb = () => { }, max = 100, min = 0, step = 1, defaultValue }: prop): JSX.Element {
    const [value, setValue] = React.useState([0, 100]);
    const onChange = (val: number[]) => {
        setValue(val);
    }
    return <ReactSlider
        className="range-slider"
        max={max}
        min={min}
        thumbClassName="Range-thumb-style"
        trackClassName="Range-track-style"
        defaultValue={defaultValue}
        ariaLabel={['Lower limit', 'Upper limit']}
        ariaValuetext={(state: any) => `Thumb value ${state.valueNow}`}
        renderThumb={(props: any, state: any) => <div {...props}>
            {renderThumb(state)}
        </div>}
        pearling
        minDistance={10}
        marks={10}
        step={step}

    />
}