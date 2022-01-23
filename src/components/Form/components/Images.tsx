import React from 'react';
import style from './Images.module.scss';
import ImageUploading, { ImageListType, ResolutionType } from "../../../libs/react-images-uploading/src";
import { isResolutionValid } from '../../../libs/react-images-uploading/src/validation';
import { getImage } from '../../../libs/react-images-uploading/src/utils';
import { Drag } from '../../../functions/DragEvent';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

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
    onBlur?: () => void
}

export function ImageUpload({ max = 1000, multiple = true, acceptType = ['jpg', 'gif', 'png', 'jpeg'],
    maxFileSize, resolutionType,
    resolutionHeight, resolutionWidth, rejectOnResolutionError, onChange = () => { } }: PropsType): JSX.Element {
    const CUSTOM_DATA_URL = "dataUrl";
    const [images, setImages] = React.useState<ImageListType>([]);
    const [dragging, setDragging] = React.useState<boolean>(false);
    const [resErrors, setResErrors] = React.useState<Set<number>>(new Set());
    const [editor, setEditor] = React.useState<number | false>(false);
    const imgRefs = React.useRef<HTMLImageElement[]>([]);//why?
    const divRef = React.useRef<HTMLDivElement>(null!);
    const cropperRef = React.useRef<HTMLImageElement>(null);
    const validating = React.useRef(false);
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
        if (validating.current === false)
            onChange(images.filter((e, i) => !resErrors.has(i)));
    }, [resErrors]);
    const onChange_ = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
        if (!rejectOnResolutionError) {
            if (addUpdateIndex) {
                validating.current = true;
                addUpdateIndex.forEach(async (i, ind) => {
                    if (ind === addUpdateIndex.length - 1)
                        validating.current = false;
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
        else
            onChange(imageList);
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
                    img.file = new File([blob], (images[i].file as File).name);
                    images[i] = img;
                    onChange_(images, [i]);
                    setEditor(false);
                }
            });
        }
    }
    console.log(resErrors);
    return (
        <ImageUploading
            multiple={multiple}
            value={images}
            onChange={onChange_}
            maxNumber={max}
            dataURLKey={CUSTOM_DATA_URL}
            acceptType={acceptType}
            maxFileSize={maxFileSize}
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
                    <div ref={divRef} className={style["imageupload-wrapper"]}>
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
                                                <button type="button" onClick={() => onImageRemove(index)} className={style["image-close-btn"]}>
                                                    <i className="fas fa-times" />
                                                </button>
                                                <button type="button" onClick={() => onImageUpdate(index)} className={style["image-update-btn"]}>
                                                    <i className="fas fa-redo" />
                                                </button>
                                                <button type="button" onClick={() => { setEditor(index) }} className={style["image-edit-btn"]}>
                                                    <i className="far fa-edit" />
                                                </button>
                                            </div>
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

                    </div>
                )
            }
            }
        </ImageUploading >
    );
}
