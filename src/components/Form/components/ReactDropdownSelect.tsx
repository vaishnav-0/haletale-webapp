import Select, { SelectProps } from 'react-dropdown-select';

export default function ReactDropdownSelect(props: SelectProps<any>) {
    return (
        <Select
            {...props}
        />
    );
}
