import axios from 'axios';


import { s3PostUrl } from '../image/index'
async function handleImage(imageList) {
    const presignedUrlPromise = [];
    imageList.forEach(e => {

        console.log(e.file.name, e.file.type)
        // if (!e.file.type)
        //     e.file.type = e.file.name.match('[^.]+$');
        // console.log(e.file.type)

        presignedUrlPromise.push(s3PostUrl(e.file));
    });
    try {
        let result = await Promise.all(presignedUrlPromise);
        console.log(result);
    }
    catch (error) {
        console.log(error)
    }
    // return new Promise((resolve, reject) => {


    // })

}

export { handleImage }