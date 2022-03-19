import axios from 'axios';
import Token from '../auth/token';


export function extractAddressComponents(d) {
    const addressComponents = ["administrative_area_level_1", "administrative_area_level_2", "country", "locality", "sublocality", "route", "street_number", "postal_code"];
    let addressComponentValues;
    addressComponentValues = d.address_components.reduce((obj, curr) => {
        const type = curr.types.find((e) => addressComponents.includes(e))
        if (type)
            obj[type] = (obj[type] ? (obj[type] + " ") : "") + curr.long_name;
        return obj;
    }, {});
    return addressComponentValues;
}
const instance = axios.create({
    baseURL: `${process.env.REACT_APP_API_SERVER_URL}/location`,
    method: 'get',
    timeout: 3000,
    headers: {
        'Authorization': new Token("id").get(),
    }
});

export async function suggest(query) {
    try {
        let res = await instance('/search', { params: { location: query } })
        return res.data.predictions.map(e => [e.description, e.place_id])
    }
    catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

export async function addressToGeo(query) {
    try {
        let res = await instance('/geocodeId', { params: { placeId: query } });
        return res.data;
    }
    catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

export async function geocode(query) {
    try {
        let res = await instance('/geocode', { params: { address: query } })
        return res.data;
    }
    catch (error) {
        console.log(error)
        throw new Error(error)
    }
}