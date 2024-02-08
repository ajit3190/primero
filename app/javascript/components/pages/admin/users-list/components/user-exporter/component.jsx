import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import omitBy from "lodash/omitBy";
import { useState } from "react";
import ActionDialog from "../../../../../action-dialog";
import Form from "../../../../../form";

import { NAME, EXPORT_TYPES, FORM_ID } from "./constants";
import { form } from "./form";
import { saveExport } from "../../../../../record-actions/exports/action-creators";
import { formatFileName } from "../../../../../record-actions/exports/utils";

import DateRangePicker from "../../../../../../components/key-performance-indicators/components/date-range-picker/component";
import { toServerDateFormat } from "../../../../../../libs";

const Component = ({ close, i18n, open, pending, setPending }) => {
  const dispatch = useDispatch();
  const dialogPending = typeof pending === "object" ? pending.get("pending") : pending;
  const message = undefined;

  // Grouping useState variables together
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

  // Handlers
  const handleDateChange = (start, end) => {
    setDateRange({ startDate: start, endDate: end });
  };

  // Form submission
  const onSubmit = getData => {
    const params = {
      ...getData,
      export_type: EXPORT_TYPES.EXCEL,
      record_type: "user"
    };

    const fileName = formatFileName(getData.file_name, "xlsx");

    const defaultBody = {
      export_format: "xlsx",
      record_type: "user",
      file_name: fileName,
      selectedFromDate: toServerDateFormat(dateRange.startDate),
      selectedToDate: toServerDateFormat(dateRange.endDate)
    };
    const data = { ...defaultBody };

    setPending(true);

    dispatch(
      saveExport(
        { data },
        i18n.t(message || "exports.queueing", {
          file_name: fileName ? `: ${fileName}.` : "."
        }),
        i18n.t("exports.go_to_exports")
      )
    );
  };

  // Props for DateRangePicker component
  const dateRangePickerProps = {
    onChange: handleDateChange,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate
  };

  return (
    <ActionDialog
      open={open}
      confirmButtonProps={{
        form: FORM_ID,
        type: "submit"
      }}
      cancelHandler={close}
      dialogTitle={i18n.t("form_export.label")}
      confirmButtonLabel={i18n.t("buttons.export")}
      pending={dialogPending}
      omitCloseAfterSuccess
    >
      <DateRangePicker {...dateRangePickerProps} />
      <Form
        useCancelPrompt
        formID={FORM_ID}
        mode="new"
        formSections={form(i18n)}
        onSubmit={onSubmit}
      />
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  close: PropTypes.func,
  i18n: PropTypes.object,
  open: PropTypes.bool,
  pending: PropTypes.bool,
  setPending: PropTypes.func
};

export default Component;
