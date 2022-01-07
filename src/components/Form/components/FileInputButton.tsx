import React from 'react';
import cssStyle from './FileInputButton.module.scss';
import { useFileUpload } from '../../../functions/hooks/useFileUpload'
import { ButtonSolid } from '../../Button';

type propsType = {
    className?: string;
    style?: React.CSSProperties
    ButtonComponent: React.FC<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>>
    | JSX.Element;
}
export default function FileInput({ className, style, ButtonComponent }: propsType): JSX.Element {
    const {
        files,
        fileNames,
        fileTypes,
        totalSize,
        totalSizeInBytes,
        handleDragDropEvent,
        clearAllFiles,
        createFormData,
        setFiles,
        removeFile,
    } = useFileUpload();
    const inputRef = React.useRef<HTMLInputElement>(null!);
    return <div className={cssStyle["btn-container"] + " " + className ?? ""} style={style}>
        <input ref={inputRef} type="file" style={{ display: 'none' }} onChange={(e) => setFiles(e, 'w')} />
        {
            typeof ButtonComponent === "function" ?
                <ButtonComponent onClick={() => inputRef.current.click()} type="button" />
                :
                React.cloneElement(ButtonComponent, {
                    onClick: () => inputRef.current.click(),
                    type: "button"
                }
                )
        }
        {files.length !== 0 &&
            <div className={cssStyle["file-info"]}>
                <div className={cssStyle["file-name"]}>
                    {fileNames[0]}
                </div>
                <button type="button" onClick={() => removeFile(0)} className={cssStyle["file-remove-btn"]}>
                    <i className="fas fa-times" />
                </button>
            </div>
        }
    </div>
}

export function FileInputButton(props: Omit<propsType, "ButtonComponent">): JSX.Element {
    return <FileInput
        ButtonComponent={<ButtonSolid type="button" className={cssStyle["file-btn"]} >Upload</ButtonSolid>}
        {...props}
    />

}
