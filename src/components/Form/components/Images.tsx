import React from 'react';
import style from './Images.module.scss';
import ImageUploading, { ImageListType, ResolutionType, ErrorsType } from "../../../libs/react-images-uploading/src";
import { isResolutionValid } from '../../../libs/react-images-uploading/src/validation';
import { getImage } from '../../../libs/react-images-uploading/src/utils';
import { Drag } from '../../../functions/DragEvent';
import { MessageBox } from '../../MessageBox';
import Cropper from "react-cropper";
import cropperjs from "cropperjs";
import "cropperjs/dist/cropper.css";
import { usePillCollection } from './PillList';
import { toast } from 'react-toastify';
export interface PropsType {
    max?: number,
    multiple?: boolean,
    acceptType?: string[],
    maxFileSize?: number,
    resolutionType?: ResolutionType,
    resolutionWidth?: number
    resolutionHeight?: number
    rejectOnResolutionError?: boolean,
    onChange?: (value: ImageListType, addUpdatedIndex?: Array<number>) => void;
    onBlur?: () => void,
    key?: React.Attributes["key"],
    disabled?: boolean

}
const tagItems = {
    single: [{ name: "cover", limit: 1, value: "cover" }, { name: "abc", limit: 3, value: "a" }],
    group: [{ name: "roomtype", label: "Room type", items: ["bedroom", "bathroom"], limit: 5 }]
}
const CUSTOM_DATA_URL = "dataUrl";

export function cropToAspectRatio(imgList: ImageListType, aspectRatio: number) {
    return new Promise((res, rej) => {
        const promiseList: Promise<any>[] = []
        imgList.forEach(async (image, i) => {
            promiseList.push(new Promise((resolve, reject) => {
                getImage(image.file as File).then(img => {
                    const checkRes = isResolutionValid(
                        img,
                        "ratio",
                        aspectRatio * 10,
                        10
                    );
                    if (!checkRes) {
                        const divElm = document.createElement("div");
                        divElm.appendChild(img);
                        const cropper = new cropperjs(img, {
                            aspectRatio: aspectRatio,
                            ready() {
                                (this as any).cropper.getCroppedCanvas().toBlob((blob: Blob | null) => {
                                    if (blob) {
                                        const reader = new FileReader();
                                        reader.readAsDataURL(blob);
                                        reader.onerror = () => {
                                            console.log("filereader error");
                                            reject("filereader error");
                                        }
                                        reader.onload = () => {
                                            imgList[i][CUSTOM_DATA_URL] = reader.result as string;
                                            imgList[i].file = new File([blob], image.file?.name??"", { type: image.file?.type, lastModified:image.file?.lastModified });
                                            resolve(true)
                                        }
                                    }
                                },image.file?.type);
                            }
                        });

                    }
                    else
                        resolve(true)
                });
            }))
        });
        Promise.all(promiseList).then(d => res(true))
    })
}
export function ImageUpload({ max = 1000, multiple = true, acceptType = ['jpg', 'gif', 'png', 'jpeg'],
    maxFileSize, resolutionType, resolutionHeight, resolutionWidth,
    rejectOnResolutionError, onChange = () => { }, key, disabled = false }: PropsType): JSX.Element {
    const [images, setImages] = React.useState<ImageListType>([]);
    const [dragging, setDragging] = React.useState<boolean>(false);
    const [resErrors, setResErrors] = React.useState<Set<number>>(new Set());
    const [editor, setEditor] = React.useState<number | false>(false);
    const imgRefs = React.useRef<HTMLImageElement[]>([]);//why?
    const divRef = React.useRef<HTMLDivElement>(null!);
    const cropperRef = React.useRef<HTMLImageElement>(null);
    console.log(images)
    // const Tags = usePillCollection({
    //     items: tagItems,
    //     pillProps: {
    //         className: style["tag"]
    //     }
    // })
    const selectedTags = React.useRef<{ [k: number]: string[] }>({})
    React.useEffect(() => {
        const divRef_ = divRef.current;
        const drag = new Drag(divRef.current);
        const enterHandler = (e: Event) => {
            setDragging(true);
        }
        const leaveHandler = (e: Event) => {
            setDragging(false);
        }
        divRef_.addEventListener("drag:enter", enterHandler)
        divRef_.addEventListener("drag:leave", leaveHandler)
        return () => {
            drag.unsuscribe();
            divRef_.removeEventListener("drag:enter", enterHandler)
            divRef_.removeEventListener("drag:leave", leaveHandler)
        }
    }, []);
    React.useEffect(() => {
        onChange(images);
    }, [images]);
    const onChange_ = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
        if (!rejectOnResolutionError) {
            if (addUpdateIndex) {
                addUpdateIndex.forEach(async (i, ind) => {
                    if (resolutionType) {
                        const image = await getImage(imageList[i].file as File);
                        const checkRes = isResolutionValid(
                            image,
                            resolutionType,
                            resolutionWidth,
                            resolutionHeight
                        );
                        if (!checkRes) {
                            setResErrors(prev => (new Set(prev)).add(i));
                        }
                        else {
                            if (resErrors.has(i))
                                setResErrors(prev => {
                                    const s = new Set(prev);
                                    s.delete(i);
                                    return s;
                                });
                        }
                    }

                });
            }
        }
        setImages(imageList);
    };
    const setEditedImage = (i: number) => {
        const cropper: any = (cropperRef?.current as any)?.cropper;
        if (cropper) {
            const img: { [CUSTOM_DATA_URL]?: string, file?: File } = {};
            cropper.getCroppedCanvas().toBlob((blob: Blob) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onerror = () => {
                    setEditor(false);
                }
                reader.onload = () => {
                    img[CUSTOM_DATA_URL] = reader.result as string;
                    img.file = new File([blob], (images[i].file as File).name,{type:images[i].file?.type,lastModified:images[i].file?.lastModified});
                    setImages(p => {
                        const newImgList = p.map((e, k) => k === i ? img : e);
                        onChange_(newImgList, [i]);
                        return newImgList;
                    });
                    setEditor(false);
                }
            },images[i].file?.type);
        }
    }
    const onError = (errors: ErrorsType, files?: ImageListType) => {
        errors && Object.entries(errors).forEach(([k, e]) => {
            if (e) {
                if (k === "maxFileSize") {
                    toast.warn("maxFileSize");
                }
                else if (k === "maxNumber") {
                    toast.warn("maxNumber");

                } else if (k === "acceptType") {
                    toast.warn("acceptType");

                } else if (k === "resolution") {
                    toast.warn("resolution");


                }
            }
        })
    }
    return (
        <ImageUploading
            multiple={multiple}
            value={images}
            onChange={onChange_}
            maxNumber={max}
            dataURLKey={CUSTOM_DATA_URL}
            acceptType={acceptType}
            maxFileSize={maxFileSize}
            onError={onError}
            {...rejectOnResolutionError ?
                {
                    resolutionType,
                    resolutionHeight,
                    resolutionWidth,
                } : {}
            }
        >
            {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
                errors
            }) => {
                return (
                    <div key={key} ref={divRef} className={style["imageupload-wrapper"]}>
                        <div className={style["imageupload-container-wrapper"]}>
                            <div onDrop={dragProps.onDrop}
                                onDragOver={dragProps.onDragOver} className={style["drag-overlay"]} style={{ display: dragging ? "" : "none" }} />
                            <div onDrop={dragProps.onDrop}
                                onDragOver={dragProps.onDragOver}
                                className={`${style["imageupload-container"]} ${dragging ? style["dragging"] : ""} ${imageList.length === 0 ? style["empty"] : ""}`}
                            >
                                <div className={style["imagelist-container"]}>
                                    {imageList.map((image, index) => (
                                        <div key={index}
                                            className={`${style["image-item"]} ${(!rejectOnResolutionError && resErrors.has(index)) ? style["image-item-error"] : ""}`}>
                                            <div key={index} className={style["image-element"]}>
                                                <img ref={el => imgRefs.current[index] = el as HTMLImageElement}
                                                    src={image[CUSTOM_DATA_URL]} alt="" />
                                                <button type="button" onClick={() => { onImageRemove(index) }} className={style["image-close-btn"]}>
                                                    <i className="fas fa-times" />
                                                </button>
                                                <button type="button" onClick={() => onImageUpdate(index)} className={style["image-update-btn"]}>
                                                    <i className="fas fa-redo" />
                                                </button>
                                                <button type="button" onClick={() => { setEditor(index) }} className={style["image-edit-btn"]}>
                                                    <i className="far fa-edit" />
                                                </button>
                                            </div>
                                            {/* <div className={style["tag-container"]}>
                                                <div className={style["tag-list-container"]}>
                                                    <Tags.List />
                                                </div>
                                                {
                                                    Tags.Groups.map(k => {
                                                        const Group = k.List;
                                                        return <div className={style["tag-group-container"]}>
                                                            <div className={style["tag-heading"]}>{k.label}</div>
                                                            <Group />
                                                        </div>
                                                    })
                                                }
                                            </div> */}

                                        </div>
                                    ))}
                                    {(editor !== false) &&
                                        <div className={style["image-editor-container"]}>
                                            <Cropper
                                                className={style["image-editor"]}
                                                aspectRatio={16 / 9}
                                                guides={false}
                                                src={images[editor][CUSTOM_DATA_URL]}
                                                ref={cropperRef}
                                            >

                                            </Cropper>
                                            <div className={style["edit-tool-container"]}>
                                                <button
                                                    type="button"
                                                    onClick={() => (cropperRef.current as any)?.cropper.rotate(-90)}
                                                    className={style["rotate-left"]}
                                                >
                                                    <i className="fas fa-undo" />

                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => (cropperRef.current as any)?.cropper.rotate(90)}
                                                    className={style["rotate-right"]}
                                                >
                                                    <i className="fas fa-redo" />
                                                </button>
                                            </div>
                                            <button type="button" onClick={() => setEditor(false)} className={style["image-editor-close-btn"]}>
                                                <i className="fas fa-times" />
                                            </button>
                                            <button type="button" onClick={() => setEditedImage(editor)} className={style["image-editor-confirm-btn"]}>
                                                <i className="fas fa-check" />
                                            </button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={style["imageupload-message-container"]}>
                            <MessageBox labelComponent={<i className="fas fa-info-circle" />}>
                                <div className={style["message-box"]} >
                                    The images highlighted in red will be cropped automatically upon upload. To crop manually
                                    click <i className="far fa-edit" /> button.

                                </div>
                            </MessageBox>
                        </div>
                        <div className={style["imageupload-btn-container"]}>
                            <button
                                type="button"
                                onClick={onImageUpload}
                                className={style["add-btn"]}
                            >
                                Add image
                            </button>
                            <button type="button"
                                className={style["remove-btn"]}
                                onClick={onImageRemoveAll}>Remove all
                            </button>
                        </div>
                        {
                            disabled && <div className={style["disable-container"]} />
                        }
                    </div>
                )
            }
            }
        </ImageUploading >
    );
}
