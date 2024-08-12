// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */
import { ENQUEUE_SNACKBAR, generate } from "../../notifier";
import { CLEAR_DIALOG } from "../../action-dialog";

import actions from "./actions";

export const saveExport = (body, message, actionLabel) => ({
  type: actions.EXPORT,
  api: {
    path: "usage_reports",
    method: "POST",
    body,
    successCallback: [
      {
        action: ENQUEUE_SNACKBAR,
        payload: {
          message,
          options: {
            variant: "success",
            key: generate.messageKey(message)
          },
          actionLabel,
          actionUrl: "/usage_reports"
        }
      },
      {
        action: CLEAR_DIALOG
      }
    ]
  }
});
