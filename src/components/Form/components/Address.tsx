import React from "react";
import { usePlaceSuggestions } from "../../../functions/hooks/usePlaceSuggestions";
import Searchbar from "../../Searchbar";
import { TextInput } from "./TextInput";
import CoordinateInput from "./CoordinateInput";
import { addressToGeo, extractAddressComponents } from '../../../functions/api/location'
type TValue = {
    address: string,
    coords: [number, number],
    addressComponents: { [k: string]: string },
}
export type PropsType = { onChange?: (v: any) => void, disabled?: boolean, defaultValue?: TValue }
export function AddressInput({ onChange, disabled, defaultValue }: PropsType) {
    const { suggestions, suggest } = usePlaceSuggestions();
    const [value, setValue] = React.useState(defaultValue);
    const textRef = React.useRef<HTMLInputElement>(null);
    React.useEffect(() => {
        if (textRef.current) {
            textRef.current.value = value?.address ?? "";
        }
        onChange && onChange(value);
    }, [value])
    React.useEffect(() => {
        console.log("rerender");
    }, [])
    return <>
        <Searchbar disabled={disabled} suggestionItems={suggestions.map(e => e[0])}
            placeholder="Search a place"
            onChange={suggest}
            onSubmit={(v, i) => {
                let value: any = {};
                value.address = v;
                addressToGeo(suggestions[i!][1]).then(d => {
                    const addressComponents = ["administrative_area_level_1", "sublocality", "administrative_area_level_2", "country", "locality", "route", "street_number", "postal_code"];
                    value.addressComponents = extractAddressComponents(d);
                    value.addressComponents.full_address = v;
                    value.coords = [d.geometry.location.lat, d.geometry.location.lng];
                    setValue(value);
                }).catch(e => {
                    console.log(e);
                });
            }}
            submitOnSuggestionClick />
        <TextInput placeholder="Address" ref={textRef} disabled={disabled}
            type="text" name="address" defaultValue={defaultValue?.address} />
        <CoordinateInput
            disabled={disabled}
            center={[55.731538, -103.650174]}
            zoom={4}
            defaultValue={defaultValue?.coords}
            coords={value?.coords}
        />
    </>
}