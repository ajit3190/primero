// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { DEFAULT_METADATA } from "../../../../config";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.USERS_STARTED:
      return state.set("loading", true);
    case actions.USERS_SUCCESS:
      return state.set("data", fromJS(payload.data)).set("metadata", fromJS(payload.metadata));
    case actions.USERS_FINISHED:
      return state.set("loading", false);
    case actions.SET_USERS_FILTER:
      return state.set("filters", fromJS(payload.data));
    case actions.CLEAR_METADATA:
      return state.set("metadata", fromJS(DEFAULT_METADATA));
    case actions.CLEAR_EXPORT_USERS:
      return state.set("export", fromJS({}));
    case actions.EXPORT_USERS_STARTED:
      return state.setIn(["export", "loading"], true);
    case actions.EXPORT_USERS_FINISHED:
      return state.setIn(["export", "loading"], false);
    case actions.EXPORT_USERS_SUCCESS:
      return state.set("export", fromJS(payload));
    default:
      return state;
  }
};
