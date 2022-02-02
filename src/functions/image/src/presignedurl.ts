import axios, { AxiosRequestConfig } from "axios";


// type post_image_object = {
//     url : String,
//     params : 
// }
let x = {
    name: 'testimg',
    extention: 'jpeg'
}

const s3_service_config: AxiosRequestConfig = {
    baseURL: 'http://99.79.78.76:11240/s3/presignedUrl',
}

const instance = axios.create(s3_service_config)



const BASE_URL: string = 'http://99.79.78.76:11240/s3/presignedUrl/';

// function getPresignedURLS(data:object):any {
//     Promise.all()
//     return;
// }

function createPresignedUrl(): any {
    instance.post('/', x).then((e) => console.log(e)).catch(e => console.log(e))

}



export { createPresignedUrl }