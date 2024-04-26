import css from "./styles.css";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useState } from "react";
import ActionDialog from "../../../../../action-dialog";
import Form from "../../../../../form";

import { NAME, FORM_ID } from "./constants";
import { form } from "./form";
import { saveExport } from "../../../../../record-actions/exports/action-creators";
import { formatFileName } from "../../../../../record-actions/exports/utils";


const Component = ({ close, i18n, open, pending, setPending }) => {
  const dispatch = useDispatch();
  const dialogPending = typeof pending === "object" ? pending.get("pending") : pending;
  const message = undefined;

  // Grouping useState variables together
  const [validationError, setValidationError] = useState("");

  // Form submission
  const onSubmit = getData => {
    // Check if any of the required fields are null
    if (!getData.From) {
      setValidationError("Please select a From date");
    } else if (!getData.To) {
      setValidationError("Please select a To date");
    } else if (!getData.file_name) {
      setValidationError("Please select a Filename");
    } else if (getData.From > getData.To) {
      setValidationError("To date should not be smaller than From date");
    } else {
      const fileName = formatFileName(getData.file_name, "xlsx");
      const defaultBody = {
        export_format: "xlsx",
        record_type: "user",
        file_name: fileName,
        selectedFromDate: getData.From,
        selectedToDate: getData.To
      };
      const data = { ...defaultBody };
      setPending(true);
      setValidationError("");
      dispatch(
        saveExport(
          { data },
          i18n.t(message || "exports.queueing", {
            file_name: fileName ? `: ${fileName}.` : "."
          }),
          i18n.t("exports.go_to_exports")
        ),
      );
    }
  };

  const handleCustomClose = () => {
    setValidationError("");
    close();
  };

  return (
    <ActionDialog
      open={open}
      confirmButtonProps={{
        form: FORM_ID,
        type: "submit"
      }}
      cancelHandler={handleCustomClose}
      dialogTitle={i18n.t("form_export.label")}
      confirmButtonLabel={i18n.t("buttons.export")}
      pending={dialogPending}
      omitCloseAfterSuccess
    >
      <Form
        useCancelPrompt
        formID={FORM_ID}
        mode="new"
        formSections={form(i18n)}
        onSubmit={onSubmit}
      //warningMessage="Please Select Values"
      />
      {validationError === "" ? null : <p className={css.dateWarning}>{validationError}</p>}
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
