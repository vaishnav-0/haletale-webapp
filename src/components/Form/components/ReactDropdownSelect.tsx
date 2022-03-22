import Select, { Props } from 'react-select';
import style from './ReactDropdownSelect.module.scss';
export default function ReactDropdownSelect(props: Props) {
    console.log(props)
    return (
        <Select
            {...props}
            className={style["select"]}
            styles={{
                control: () => ({
                    height: "100%",
                    display: "flex",
                })
            }}
        />
    );
}
