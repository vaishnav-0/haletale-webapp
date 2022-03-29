import React from 'react';
import ReactSlider from 'react-slider'
import './Range.scss';
export type PropType = {
    renderThumb?: (state: { value: number | number[], index: number, valueNow: number }) => void
    max?: number,
    min?: number,
    step?: number,
    onChange?: (v: number[] | number) => void,
    defaultValue?: number | number[],
    key?: React.Attributes["key"],
}

export function Range({ renderThumb = () => { }, max = 100, min = 0, step = 1, defaultValue, onChange, key }: PropType): JSX.Element {
    const sliderRef = React.useRef(null)
    const [touched, setTouched] = React.useState<boolean>(false);
    React.useEffect(() => {
        if ((sliderRef.current as any)?.slider === null) return

        function _handleResize() {
            // If offsetParent is null, the element is not visible
            if ((sliderRef.current as any).slider.offsetParent !== null) {
                (sliderRef.current as any).resize()
            }
        }

        // Observe the slider dom element which will trigger when it's shown via a parent container visibility
        const ro = new ResizeObserver(_handleResize)
        ro.observe((sliderRef.current as any).slider)

        // Cleanup
        return () => {
            ro.disconnect()
        }
    }, [])
    return <ReactSlider
        key={key}
        className="range-slider"
        max={max}
        min={min}
        onChange={onChange}
        thumbClassName={`Range-thumb-style ${!touched ? "untouched" : ""}`}
        trackClassName={`Range-track-style${!touched ? "-untouched" : ""}`}
        defaultValue={defaultValue}
        ariaLabel={['Lower limit', 'Upper limit']}
        ariaValuetext={(state: any) => `Thumb value ${state.valueNow}`}
        renderThumb={(props: any, state) => <div {...props}>
            {renderThumb(state)}
        </div>}
        pearling
        minDistance={10}
        step={step}
        ref={sliderRef}
        onSliderClick={() => setTouched(true)}
    />
}
