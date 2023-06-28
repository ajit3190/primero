import { Box, FormControl, MenuItem, Select } from "@material-ui/core";
import { useEffect, useState } from "react";
import useOptions from "../../../../../../form/use-options";
import { LOOKUPS } from "../../../../../../../config";

const VerifySelect = ({selectedValue, setSelectedValue}) => {
    const  [defaultValues, setDefaultValue] = useState(selectedValue);
    const verificationStatus = useOptions({ source: LOOKUPS.verification_status });
    
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
                        verificationStatus.map((option) => (
                            <MenuItem key={option.display_text} value={option.display_text} style={{ display: option.display_text === (defaultValues) ? 'none' : 'block'}}>{option.display_text}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
        </Box>
    );
}
export default VerifySelect

