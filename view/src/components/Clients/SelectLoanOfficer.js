import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const SelectLoanOfficer = ({loanOfficers, onChange, selectedLoanOfficer, classes}) => {
    return (
        <FormControl className={classes.formControl} fullWidth>
            <InputLabel id="demo-simple-select-label">Loan Officer</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedLoanOfficer}
                onChange={onChange}
            >
                {loanOfficers.map((lo) => (
                    <MenuItem value={lo.userId}>{lo.firstName} {lo.surname}</MenuItem>
                ))}
            </Select>
            {selectedLoanOfficer.firstName}
        </FormControl>
    )
}

export default SelectLoanOfficer;