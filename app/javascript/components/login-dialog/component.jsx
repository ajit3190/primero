// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import ActionDialog, { useDialog } from "../action-dialog";
import { useApp } from "../application/use-app";
import { useI18n } from "../i18n";
import Login from "../login";
import { FORM_ID } from "../login/components/login-form/constants";
import utils from "../login/utils";

import { LOGIN_DIALOG } from "./constants";

function Component() {
  const i18n = useI18n();
  const { demo } = useApp();

  const { dialogOpen, pending } = useDialog(LOGIN_DIALOG);

  const { title, actionButton } = utils.loginComponentText(i18n, demo);

  return (
    <ActionDialog
      open={dialogOpen}
      dialogTitle={title}
      confirmButtonLabel={actionButton}
      hideIcon
      maxSize="xs"
      pending={pending}
      confirmButtonProps={{
        type: "submit",
        form: FORM_ID
      }}
      disableClose
      omitCloseAfterSuccess
    >
      <Login modal />
    </ActionDialog>
  );
}

Component.displayName = "LoginDialog";

export default Component;
