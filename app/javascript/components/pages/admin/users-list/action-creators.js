// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { RECORD_PATH, METHODS } from "../../../../config";
import { CLEAR_DIALOG } from "../../../action-dialog";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";

import actions from "./actions";
import { EXPORT_USERS_PATH } from "./components/user-exporter/constants";

export const fetchUsers = params => {
  const { data } = params || {};

  return {
    type: actions.USERS,
    api: {
      path: RECORD_PATH.users,
      params: data
    }
  };
};

export const setUsersFilters = payload => ({
  type: actions.SET_USERS_FILTER,
  payload
});

export const exportUsers = ({ params, message }) => ({
  type: actions.EXPORT_USERS,
  api: {
    path: EXPORT_USERS_PATH,
    method: METHODS.GET,
    params,
    successCallback: [
      {
        action: CLEAR_DIALOG
      },
      {
        action: ENQUEUE_SNACKBAR,
        payload: {
          message,
          options: {
            variant: "success",
            key: generate.messageKey(message)
          }
        },
        redirectWithIdFromResponse: false,
        redirect: false
      }
    ]
  }
});

export const clearExportUsers = () => ({
  type: actions.CLEAR_EXPORT_USERS
});