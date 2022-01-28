import React from 'react';
import cssStyle from './FileInputButton.module.scss';
import { useFileUpload } from '../../../functions/hooks/useFileUpload'
import { ButtonSolid } from '../../Button';
import { InputPropsType } from './types';
import { TextInput } from '..';
import { PropType } from './Range';

export interface PropsType extends InputPropsType {
    className?: string;
    style?: React.CSSProperties
    ButtonComponent: React.FC<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>>
    | JSX.Element;
}
export type FileInputButtonPropsType = Omit<PropsType,"ButtonComponent">

export const FileInput = React.forwardRef<HTMLInputElement, PropsType>(({ className, style, ButtonComponent }: PropsType, ref) => {
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
        <input type="file" style={{ display: 'none' }} onChange={(e) => setFiles(e, 'w')}
            ref={e => {
                inputRef.current = e as HTMLInputElement;
                if (ref)
                    typeof ref === 'function' ? ref(e) : ref.current = e as HTMLInputElement;
            }}
        />
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
});
export const FileInputButton = React.forwardRef<HTMLInputElement, Omit<PropsType, "ButtonComponent">>((props, ref) => {
    return <FileInput
        {...props}
        ref={ref}
        ButtonComponent={<ButtonSolid type="button" className={cssStyle["file-btn"]} >Upload</ButtonSolid>}
    />
});