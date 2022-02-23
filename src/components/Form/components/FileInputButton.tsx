import React from 'react';
import cssStyle from './FileInputButton.module.scss';
import { useFileUpload } from '../../../functions/hooks/useFileUpload'
import { ButtonSolid } from '../../Button';
import { TextInput } from './TextInput';


export interface PropsType {
    className?: string;
    style?: React.CSSProperties
    ButtonComponent: React.FC<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>>
    | JSX.Element,
    key?: React.Attributes["key"],
    onChange?: (v: { file: File, name: string }[]) => void,
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
    const inputRef = React.useRef<HTMLInputElement>(null!);
    const [fileNamesMap, setFileNamesMap] = React.useState<{ [k: string]: string | null }>({});
    const textInputRefs = React.useRef<HTMLInputElement[]>([]);
    React.useEffect(() => {
        setFileNamesMap(fileNames.reduce((obj, name, i) => {
            //sanitize filename?
            console.log();
            if (!fileNamesMap[name])
                obj[name] = name.substring(0, name.search(/\.[a-zA-Z0-9]+/));
            else
                obj[name] = fileNamesMap[name];
            console.log(textInputRefs.current[i]);
            textInputRefs.current[i] && (textInputRefs.current[i].value = obj[name])
            return obj;
        }, {} as any)
        );
    }, [fileNames])
    React.useEffect(() => {
        onChange(fileNames.map((name, i) => { return { file: files[i], name: fileNamesMap[name]! + name.substring(name.search(/\.[a-zA-Z0-9]+/)) } }));
    }, [fileNamesMap]);
    console.log(fileNamesMap);
    return <div key={key} className={`${cssStyle["file-container"]} ${className ?? ""}`} style={style}>
        <input multiple={multiple} type="file" style={{ display: 'none' }} onChange={(e) => setFiles(e, 'w')}
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
                    fileNames.map((name, i) => <div key={name} className={cssStyle["filename-contaniner"]}>
                        <TextInput type="text" name={"filename" + i} className={cssStyle["file-name"]}
                            onChange={(e) => setFileNamesMap(fileMap => { return { ...fileMap, [name]: e.target.value } })}
                            ref={node => textInputRefs.current[i] = node!} defaultValue={name} />
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