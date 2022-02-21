import React from 'react';
import cssStyle from './FileInputButton.module.scss';
import { useFileUpload } from '../../../functions/hooks/useFileUpload'
import { ButtonSolid } from '../../Button';
import { InputPropsType } from './types';
import { TextInput } from '..';
import { PropType } from './Range';

export interface PropsType {
    className?: string;
    style?: React.CSSProperties
    ButtonComponent: React.FC<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>>
    | JSX.Element,
    key?: React.Attributes["key"],
    onChange?: (v: File[]) => void,
    multiple?: boolean
}
export type FileInputButtonPropsType = Omit<PropsType, "ButtonComponent">

export const FileInput = React.forwardRef<HTMLInputElement, PropsType>(({ className = "", style, key,
    ButtonComponent, onChange = () => { }, multiple = false }: PropsType, ref) => {
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
    React.useEffect(() => {
        onChange(files);
    }, [files])
    const inputRef = React.useRef<HTMLInputElement>(null!);
    return <div key={key} className={className} style={style}>
        <input multiple={multiple} type="file" style={{ display: 'none' }} onChange={(e) => { setFiles(e, 'w'); console.log(e) }}
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
                {
                    fileNames.map((name, i) => <div key={name} style={{ display: "flex" }}>
                        <div className={cssStyle["file-name"]}>
                            {name}
                        </div>
                        <button type="button" onClick={() => { removeFile(i); }} className={cssStyle["file-remove-btn"]}>
                            <i className="fas fa-times" />
                        </button>
                    </div>)
                }

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