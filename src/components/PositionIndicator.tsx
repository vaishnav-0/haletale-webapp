import React from 'react';
import cssStyle from "./PositionIndicator.module.scss";
type PropType = {
    count: number,
    position?: number
    onChange?: (pos: number) => void
    className?: string
    style?: React.CSSProperties;
}
export default function ({ count, position = 0, onChange = () => { }, className, style }: PropType): JSX.Element | null {
    if (count < 1) {
        return null;
    }
    const [pos, setPos] = React.useState(0);
    const posRef = React.useRef(pos);
    const dotRefs = React.useRef<(HTMLDivElement | null)[]>([])
    React.useEffect(() => {
        setPos(position);
    }, [position]);
    React.useEffect(() => {
        posRef.current = pos;
    }, [pos]);
    React.useEffect(() => {
        const refs = dotRefs.current;
        const eventHandlers: (() => void)[] = []
        refs.forEach((e, i) => {
            const clickHandler = function () {
                if (posRef.current !== i) {
                    setPos(i);
                    onChange(i);
                }
            }
            eventHandlers.push(clickHandler)
            e?.addEventListener('click', clickHandler);
        });
        return () => {
            refs.forEach((e, i) => {
                e?.removeEventListener('click', eventHandlers[i]);
            });
        }

    }, [count]);
    return (
        <div style={style} className={cssStyle["indicator-container"] + " " + className ?? ""}>
            {
                [...Array(count)].map((e, i) => <div key={i} ref={el => dotRefs.current[i] = el} className={pos === i ? cssStyle["active"] : ""}></div>)
            }
        </div>
    );
}