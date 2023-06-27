import { Box, FormControl, MenuItem, Select } from "@material-ui/core";
import { useEffect, useState } from "react";

const options = [
    { label: 'Verified', value: 'verified' },
    { label: 'Unverified', value: 'unverified' },
    { label: 'Pending Verification', value: 'pending_verification' },
    { label: 'Falsely Attributed', value: 'falsely_attributed' },
    { label: 'Report pending verification', value: 'report_pending_verification' },
    { label: 'Not MRM', value: 'not_mrm' },
    { label: 'Verification found that incident did not occur', value: 'verification_found_that_incident_did_not_occur' }
]

const VerifySelect = ({selectedValue, setSelectedValue}) => {
    const  [defaultValues, setDefaultValue] = useState(selectedValue);

    useEffect(()=>{ 
        setSelectedValue("");
    },[]);

    const handleChange = (event) => { // Change dropdown value
        setSelectedValue(event.target.value);
        setDefaultValue(event.target.value);
    };

    return (
        <Box sx={{ minWidth: 60 }}>
            <FormControl fullWidth>
                <Select
                    value={selectedValue}
                    onChange={handleChange}
                    onSel
                    MenuProps={{
                        getContentAnchorEl: null,
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: 'left'
                        },
                        transformOrigin: {
                            vertical: "top",
                            horizontal: 'left'
                        }
                    }}
                >
                    {
                        options.map((option) => (
                            <MenuItem key={option.value} value={option.value} style={{ display: option.value === (defaultValues) ? 'none' : 'block'}}>{option.label}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
        </Box>
    );
}
export default VerifySelect

