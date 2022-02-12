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

    }).then(res => console.log(res)).catch(e => console.log(e))
}

export const s3GetUrl = (file) => {
    instance.get("/s3/preSignedUrl", {
        body: {
            key: file.key,
        }

    }).then(res => console.log(res)).catch(e => console.log(e))
}

//const s3PutUrl = 
