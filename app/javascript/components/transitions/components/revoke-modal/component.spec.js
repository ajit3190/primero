import { fromJS } from "immutable";

import { mountedComponent,screen } from "../../../../test-utils";
import ActionDialog from "../../../action-dialog";

import RevokeModal from "./component";

describe("<RevokeModal /> - Component", () => {
  const props = {
    name: "transferModal-1",
    close: () => {},
    open: true,
    pending: false,
    recordType: "cases",
    setPending: () => {},
    transition: {
      id: "1",
      record_id: "5a291f55-c92a-4786-be2a-13b98fd143e1",
      record_type: "case",
      created_at: "2020-02-14T23:00:35.345Z",
      notes: "",
      rejected_reason: "",
      status: "in_progress",
      type: "Transfer",
      consent_overridden: true,
      consent_individual_transfer: false,
      transitioned_by: "primero_admin_cp",
      transitioned_to: "primero_cp_ar",
      service: "legal_assistance_service"
    }
  };
  const state = fromJS({});


  it("renders ActionDialog component", () => {
    mountedComponent(<RevokeModal {...props} />, state)
    expect(screen.queryAllByRole('dialog')).toHaveLength(1);
  });
});
