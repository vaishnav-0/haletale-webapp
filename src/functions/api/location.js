import axios from 'axios';
import Token from '../auth/token';

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
        console.log(res)
        return res.data;
    }
    catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

export async function addressToGeo(query) {
    try {
        let res = await instance('/geocodeId', { params: { placeId: query } });
        console.log(res)
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
        console.log(res)
        return res.data;
    }
    catch (error) {
        console.log(error)
        throw new Error(error)
    }
}