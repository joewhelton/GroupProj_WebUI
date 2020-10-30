import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const SelectFinancialInstitution = ({financialInstitutions, onChange, selectedFI, classes}) => {
    return (
        <FormControl className={classes.formControl} fullWidth>
            <InputLabel id="demo-simple-select-label">Financial Institution</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedFI}
                onChange={onChange}
            >
                {financialInstitutions.map((fi) => (
                    <MenuItem value={fi.id}>{fi.name}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default SelectFinancialInstitution;