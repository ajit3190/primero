// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import { useI18n } from "../../../../../i18n";
import { getSavingRecord } from "../../selectors";
import { FormAction } from "../../../../../form";
import { useMemoizedSelector } from "../../../../../../libs";

import { NAME } from "./constants";

function Component({ formMode, handleSubmit, handleCancel, limitedProductionSite }) {
  const i18n = useI18n();

  const saving = useMemoizedSelector(state => getSavingRecord(state));

  const saveButton = (formMode.get("isEdit") || formMode.get("isNew")) && (
    <>
      <FormAction
        cancel
        actionHandler={handleCancel}
        text={i18n.t("buttons.cancel")}
        startIcon={<CloseIcon />}
        options={{ hide: limitedProductionSite }}
      />
      <FormAction
        actionHandler={handleSubmit}
        text={i18n.t("buttons.save")}
        startIcon={<CheckIcon />}
        savingRecord={saving}
        options={{ hide: limitedProductionSite }}
      />
    </>
  );

  return saveButton;
}

Component.displayName = NAME;

Component.propTypes = {
  formMode: PropTypes.object.isRequired,
  formRef: PropTypes.object.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  limitedProductionSite: PropTypes.bool
};

export default Component;
