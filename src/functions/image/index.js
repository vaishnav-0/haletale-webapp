import axios from 'axios'
import { TypeKind } from 'graphql';
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

    return instance.post("/s3/preSignedUrl", {
        body: {
            key: file.key,
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
