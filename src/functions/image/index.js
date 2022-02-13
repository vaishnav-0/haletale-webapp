import axios from 'axios'
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


let token = new Token().get();

const instance = axios.create({
    baseURL: 'http://3.97.148.224:11240/'
});

instance.defaults.headers.common['Authorization'] = token;


export const s3PostUrl = (file) => {

    instance.post("/s3/preSignedUrl", {
        body: {
            key: file.key,
            type: file.type
        }

    })

    //.then(res => console.log(res)).catch(e => console.log(e))
}

export const s3GetUrl = (file) => {
    instance.get("/s3/preSignedUrl", {
        body: {
            key: file.key,
        }

    }).then(res => console.log(res)).catch(e => console.log(e))
}



const dt = [{ key: 'p1', type: 'jpeg' }, { key: 'p2', type: 'jpeg' }, { key: 'p3', type: 'jpeg' }]



export function x() {
    let i = 0
    let reqq = []
    dt.forEach(element => {
        x = s3GetUrl(element)
        reqq.push(x)
    });
    Promise.all(reqq).then(x => {
        console.log(x)
    })
        .catch(e => console.log(e))
}

//const s3PutUrl = 
