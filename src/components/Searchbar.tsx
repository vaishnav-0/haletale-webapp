import React from 'react';
import style from "./Searchbar.module.scss";
import searchIcon from "../assets/icons/search.png";
import { clickOutsideEvent } from '../functions/domEvents';
type PropsType = {
    onChange?: (v: string) => void,
    onSubmit?: (v: string, i?: number) => void,
    placeholder?: string,
    submitOnSuggestionClick?: boolean,
    suggestionItems?: string[];
    disabled?: boolean
}
export default function ({ onChange = () => { }, onSubmit = () => { },
    submitOnSuggestionClick = false, suggestionItems, placeholder = "", disabled = false }: PropsType): JSX.Element {
    const [suggestionsOpen, setSuggestionsOpen] = React.useState<boolean>(false);
    const componentRef = React.useRef(null!)
    const inpRef = React.useRef<HTMLInputElement>(null);
    React.useEffect(() => {
        return clickOutsideEvent(componentRef, () => setSuggestionsOpen(false))
    }, [])
    const suggestionOnClick = (v: string, i: number) => {
        if (inpRef.current)
            inpRef.current.value = v;
        setSuggestionsOpen(false);
        submitOnSuggestionClick && onSubmit(inpRef.current?.value ?? "", i);
    }
    return (
        <div ref={componentRef}
            className={style["searchbox-container"]}>
            <div className={style["searchbox-input-field"]}>
                <input
                    onFocus={() => setSuggestionsOpen(true)}
                    ref={inpRef}
                    placeholder={placeholder} type="text"
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                />
            </div>
            <div className={style["searchbox-btn"]}>
                <button onClick={() => onSubmit(inpRef.current?.value ?? "")}>
                    <img src={searchIcon} />
                </button>
            </div>
            {
                suggestionsOpen && suggestionItems &&
                <div className={style["suggestions-container"]}>
                    {
                        suggestionItems.map((e, i) => <button key={i} onClick={() => suggestionOnClick(e, i)}>{e}</button>
                        )
                    }
                </div>
            }
        </div>
    );
}