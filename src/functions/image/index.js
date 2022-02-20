import axios, { AxiosPromise } from 'axios'
import { TypeKind } from 'graphql';
import PropertySearchListing from '../../pages/PropertySearchListing';
import Token from '../auth/token';


// const uploadToBucket = (resolve , reject) : promiseFn=>{
//     return new Promise<Val>((resolve : Function , reject : Function)=>{

//     })
// }



// declare function hello() : String;

// function hello(){
//  return "s"   
// }


// export { }
let instance = {}
function tk() {
    instance = axios.create({
        baseURL: 'http://3.97.148.224:11240/'
    });

    instance.defaults.headers.common['Authorization'] = new Token("id").get();
    ;
    console.log(new Token("id").get())

    return instance
}


export const s3PostUrl = (file) => {
    instance = axios.create({
        baseURL: 'http://3.97.148.224:11240/'
    });

    instance.defaults.headers.common['Authorization'] = new Token("id").get();
    return instance.post("/s3/preSignedUrl", {
        body: {
            name: file.name,
            type: file.type
        }

    })

    //.then(res => console.log(res)).catch(e => console.log(e))
}

export const s3GetUrl = ({ key }) => {
    instance.get("/s3/preSignedUrl/${key}").then(res => console.log(res)).catch(e => console.log(e))
}



const dt = [{ name: 'p1', extention: 'jpeg' }, { name: 'p2', extention: 'jpeg' }, { name: 'p3', extention: 'jpeg' }]



export function x() {


    tk()
    let i = 0
    let reqq = []
    dt.forEach(element => {
        x = s3PostUrl(element)
        reqq.push(x)
    });
    Promise.all(reqq).then(x => {
        console.log(x)
    }).catch(e => console.log(e))
}

//const s3PutUrl = 
//{ file: File, url: string, fields: { ["string"]: any } }

const uploadToBucket = async (file, url, fields) => {

    const form = new FormData();
    Object.entries(fields).forEach(([field, value]) => {
        form.append(field, value);
    });
    form.append("file", file)
    try {
        let res = await axios.post(url, {
            method: "post",
            headers: {
                "Authorization": `Bearer ${new Token("id").get()}`,
                "Content-Type": "multipart/form-data"
            },
            data: form
        })

        return res;
    }
    catch (error) {
        throw new Error(error)
    }
}


