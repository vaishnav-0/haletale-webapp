import axios from 'axios';
import { s3PostUrl } from '../image/index'
import { toast } from 'react-toastify'
async function getpresignedUrl(imageList) {
    const presignedUrlPromise = [];
    imageList.forEach(({ file }) => {
        //     e.file.type = e.file.name.match('[^.]+$');
        presignedUrlPromise.push(s3PostUrl(file));
    });

    try {
        let result = await Promise.all(presignedUrlPromise);
        return result;
    }
    catch (error) {
        console.log(error)
        toast.error('Network error. Please try again', {
            position: "bottom-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        throw new Error(error);
    }
}

const uploadToBucket = async (file, url, fields) => {

    const form = new FormData();
    Object.entries(fields).forEach(([field, value]) => {
        form.append(field, value);
    });
    form.append("file", file);
    try {
        let res = await axios.post(url, form, {
            headers: {
                "enctype": "multipart/form-data",
                "Content-Type": "multipart/form-data"
            },
        })

        return res;
    }
    catch (error) {
        throw new Error(error)
    }
}


export const handleImage = async (fileL) => {
    let uploadArray = [];
    let result = await getpresignedUrl(fileL);
    let i = 0
    result.forEach(({ data }) => {
        uploadArray.push(uploadToBucket(fileL[i].file, data.url, data.fields));
        i++;
    })
    try {
        let keys = [];
        let res = await Promise.all(uploadArray);
        result.map(x => keys.push(x.data.fields.key));
        console.log(keys)
        return keys;
    }
    catch (e) {
        throw new Error(e)
    }
}
