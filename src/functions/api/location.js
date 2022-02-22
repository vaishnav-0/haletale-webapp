import axios from 'axios';
import Token from '../auth/token';
import { objectReduce } from '../utils';

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
        return res.data.predictions.map(e=>[e.description,e.place_id])
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