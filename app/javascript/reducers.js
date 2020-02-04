import reduceReducers from "reduce-reducers";
import { combineReducers } from "redux-immutable";

import * as Application from "./components/application";
import * as Flagging from "./components/flagging";
import * as I18n from "./components/i18n";
import * as Nav from "./components/nav";
import * as Notifier from "./components/notifier";
import * as Dashboard from "./components/pages/dashboard";
import * as ExportList from "./components/pages/export-list";
import { reducers as loginReducers } from "./components/pages/login/login-form";
import { reducers as idpReducers } from "./components/pages/login";
import { reducers as requestApprovalReducers } from "./components/record-actions/request-approval";
import * as PotentialMatches from "./components/pages/potential-matches";
import * as Report from "./components/pages/report";
import * as Reports from "./components/pages/reports-list";
import * as Support from "./components/pages/support";
import * as TaskList from "./components/pages/task-list";
import * as UsersList from "./components/pages/admin/users-list";
import * as UsersForm from "./components/pages/admin/users-form";
import * as Transitions from "./components/record-actions/transitions";
import * as RecordForms from "./components/record-form";
import * as Records from "./components/records";
import * as SavedSearches from "./components/saved-searches";
import * as TransitionsForms from "./components/transitions";
import * as User from "./components/user";
import * as IndexFilters from "./components/index-filters";
import * as TransferRequest from "./components/record-list/view-modal/transfer-request";
import { reducer as transferApprovalReducers } from "./components/transitions/transfers/transfer-approval";
import { RECORD_TYPES } from "./config";

const rootReducer = {
  records: reduceReducers(combineReducers({
    ...{
      ...Object.keys(RECORD_TYPES).reduce((r, i) => {
        const o = r;

        o[i] = reduceReducers(Records.reducers(i), IndexFilters.reducers(i), requestApprovalReducers(i));

        return o;
      }, {})
    },
    reports: reduceReducers(Reports.reducers, Report.reducers),
    transitions: reduceReducers(
      Transitions.reducers,
      TransitionsForms.reducers,
      TransferRequest.reducers
    ),
    ...PotentialMatches.reducers,
    ...TaskList.reducers,
    users: reduceReducers(UsersList.reducers, UsersForm.reducers),
    ...Dashboard.reducers,
    ...ExportList.reducers,
    ...Support.reducers,
    ...Flagging.reducers,
    ...SavedSearches.reducers,
  }),
  transferApprovalReducers),
  ui: combineReducers({
    ...Nav.reducers,
    ...I18n.reducers,
    ...loginReducers
  }),
  ...User.reducers,
  ...RecordForms.reducers,
  ...Notifier.reducers,
  ...Application.reducers,
  ...idpReducers
};

export default rootReducer;
