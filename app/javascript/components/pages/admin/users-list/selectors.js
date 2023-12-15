// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

import { List } from "immutable";

const adminUsersPath = ["records", "admin", "forms"];

export const selectListHeaders = (state, namespace) => state.getIn(["user", "listHeaders", namespace], List([]));

export const getExportedUsers = state => state.getIn([...adminUsersPath, "export", "data"], false);
