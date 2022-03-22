import style from './Form.module.scss';
type TData = { [k: string]: string | number | TData[], }
export default function DisplayData({ data, main = true, row }: { data: TData, main?: boolean, row?: boolean }): JSX.Element {
    return <>{
        Object.entries(data).map(([k, v]) => {
            return (<div className={(row ? `${style["row"]} ` : "") + style["form-display-container"]}>
                <div className={style["form-display-heading"] + (main ? ` ${style["main"]}` : "")}>{k}</div>
                {
                    Array.isArray(v) ?
                        v.map(e => <DisplayData data={e as TData} main={false} row />)
                        :

                        <div className={style["form-display-item"]}>
                            {v}
                        </div>
                }
            </div>
            )

        })
    }
    </>
}