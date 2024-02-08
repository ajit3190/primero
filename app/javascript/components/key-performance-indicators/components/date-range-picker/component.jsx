import React, { useState } from "react";
import PropTypes from "prop-types";

import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import { useI18n } from "../../../i18n";
import { DATE_FORMAT } from "../../../../config/constants";

const DateRangePicker = ({ from, to, onChange, maxDate }) => {
  const i18n = useI18n();
  const [selectedFromDate, setSelectedFromDate] = useState(from);
  const [selectedToDate, setSelectedToDate] = useState(to);
  const [validationError, setValidationError] = useState("");

  const handleFromChange = (date) => {
    if (selectedToDate && date > selectedToDate) {
      setValidationError("From date should not be greater than To date");
      setSelectedFromDate(null);
    } else {
      setValidationError("");
      setSelectedFromDate(date);
      onChange(date, selectedToDate);
    }
  };

  const handleToChange = (date) => {
    if (selectedFromDate && selectedFromDate > date) {
      setValidationError("To date should not be smaller than From date");
      setSelectedToDate(null);
    } else {
      setValidationError("");
      setSelectedToDate(date);
      onChange(selectedFromDate, dat);
    }
  };

  return (
    <>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <KeyboardDatePicker
            variant="inline"
            format={DATE_FORMAT}
            margin="normal"
            label={i18n.t("key_performance_indicators.date_range_dialog.from")}
            value={selectedFromDate}
            onChange={handleFromChange}
            error={!!validationError}
            maxDate={maxDate || new Date()} // Allow customization of maxDate
            InputProps={{
              style: {
                borderColor: validationError ? "red" : undefined
              },
            }}
            KeyboardButtonProps={{
              "aria-label": i18n.t("key_performance_indicators.date_range_dialog.aria-labels.from")
            }}
          />
          <KeyboardDatePicker
            variant="inline"
            format={DATE_FORMAT}
            margin="normal"
            label={i18n.t("key_performance_indicators.date_range_dialog.to")}
            value={selectedToDate}
            onChange={handleToChange}
            error={!!validationError}
            maxDate={maxDate || new Date()} // Allow customization of maxDate
            InputProps={{
              style: {
                borderColor: validationError ? "red" : undefined,
                marginLeft: "10px", // Add left margin here
              },
            }}
            KeyboardButtonProps={{
              "aria-label": i18n.t("key_performance_indicators.date_range_dialog.aria-labels.to")
            }}
          />
        </div>
      </MuiPickersUtilsProvider>
      <p>{validationError}</p>
    </>
  );
};

DateRangePicker.propTypes = {
  from: PropTypes.instanceOf(Date),
  to: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  maxDate: PropTypes.instanceOf(Date),
};

DateRangePicker.defaultProps = {
  from: null,
  to: null,
  maxDate: new Date(),
};

export default DateRangePicker;
