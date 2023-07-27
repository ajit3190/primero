import { Accordion, AccordionSummary } from "@material-ui/core";
import { fromJS } from "immutable";

import { mountedComponent, screen } from "test-utils";
import ActionButton from "../../../../../action-button";

import MatchedTracePanel from "./component";

describe("<MatchedTracePanel />", () => {
  let component;
  const props = { css: {}, matchedTrace: fromJS({ id: "123457" }) };

  beforeEach(() => {
    mountedComponent(<MatchedTracePanel {...props} />);
  });

  it("should render 1 <ActionButton /> component", () => {
    expect(screen.getByText("123457")).toBeInTheDocument();
  });

});
