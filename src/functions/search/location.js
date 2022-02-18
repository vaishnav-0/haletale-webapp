import axios from 'axios';



async function suggest(query) {
    try {
        let res = await axios.get(process.env.MAPS_URL, {
            params: {
                address: query
            }
        })
        console.log(res)
        return res;
    }
    catch (error) {
        console.log(error)
        throw new Error(error)
    }
    // return new Promise((resolve,reject)=>{

    // })

}

async function addressToGeo(query) {
    try {
       
        let res = await axios.get(process.env.MAPS_URL, {
            params: {
                address: query
            }
        })
        console.log(res)
        return res;
    }

    catch (error) {
        console.log(error)
        throw new Error(error)
    }
    // return new Promise((resolve,reject)=>{

    // })
}

