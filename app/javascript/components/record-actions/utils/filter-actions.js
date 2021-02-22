import isEmpty from "lodash/isEmpty";

import { RECORD_TYPES } from "../../../config";

export default ({ recordType, showListActions, isIdSearch, record }) => item => {
  const actionCondition = typeof item.condition === "undefined" || item.condition;

  const allowedRecordType =
    [RECORD_TYPES.all, recordType].includes(item.recordType) ||
    (Array.isArray(item.recordType) && item.recordType.includes(recordType));

  if (showListActions && allowedRecordType && !isIdSearch) {
    return item.recordListAction && actionCondition;
  }

  const allowedRecordTypeAndCondition = allowedRecordType && actionCondition;

  if (isIdSearch && isEmpty(record)) {
    return allowedRecordTypeAndCondition && item.showOnSearchResultPage;
  }

  return allowedRecordTypeAndCondition;
};
