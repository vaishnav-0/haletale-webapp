import style from './Form.module.scss';
type TData = { [k: string]: string | number | TData, }
export default function DisplayData({ data, main = true }: { data: TData, main?: boolean }): JSX.Element {
    console.log(data)
    return <>{
        Object.entries(data).map(([k, v]) => {
            console.log(k, v)
            return (<>
                <div className={style["form-display-heading"] + (main ? ` ${style["main"]}` : "")}>{k}</div>
                <div className={style["form-display-item"]}>
                    {
                        typeof v === 'object' ?
                            <DisplayData data={v as TData} main={false} />
                            :
                            v
                    }
                </div>
            </>
            )

        })
    }
    </>
}