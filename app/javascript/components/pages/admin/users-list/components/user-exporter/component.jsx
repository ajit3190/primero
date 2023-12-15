import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import omitBy from "lodash/omitBy";
import isEmpty from "lodash/isEmpty";

import ActionDialog from "../../../../../action-dialog";
import Form from "../../../../../form";
import { exportUsers, clearExportUsers } from "../../../../../pages/admin/forms-list/action-creators";
// import { exportUsers, clearExportUsers } from "../../action-creators";
import { getExportedUsers } from "../../selectors";
import { useMemoizedSelector } from "../../../../../../libs";

import { NAME, EXPORT_TYPES, EXPORTED_URL, FORM_ID } from "./constants";
import { form } from "./form";
import { saveExport } from "../../../../../record-actions/exports/action-creators";
import { ALL_EXPORT_TYPES } from "../../../../../record-actions/exports/constants";
import { formatFileName} from "../../../../../record-actions/exports/utils";

const Component = ({ close, i18n, open, pending, setPending }) => {
  const dispatch = useDispatch();
  const dialogPending = typeof pending === "object" ? pending.get("pending") : pending;

  const exportedUsers = useMemoizedSelector(state => getExportedUsers(state));
  const message = undefined;

  const onSubmit = dataa => {
    const params = {
      ...dataa,
      export_type: EXPORT_TYPES.EXCEL,
      record_type: "user",
      module_id: "primeromodule-cp"
    };
    const fileName = formatFileName(dataa.file_name, "xlsx");

    const defaultBody = {
      export_format: "xlsx",
      record_type: "user",
      file_name: fileName
    };
    const data = {...defaultBody};

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

  useEffect(() => {
    if (exportedUsers.size > 0 && !isEmpty(exportedUsers.get(EXPORTED_URL))) {
      window.open(exportedUsers.get(EXPORTED_URL));
    }

    return () => {
      dispatch(clearExportUsers());
    };
  }, [exportedUsers]);

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
