import { fromJS } from "immutable";

import { mountedComponent, screen } from "test-utils";

import { MatchedTracePanel } from "./components";
import MatchedTraces from "./component";

describe("<MatchedTraces />", () => {
  let component;
  const props = {
    data: fromJS([{ id: "1234567" }]),
    setSelectedForm: () => {},
    record: fromJS({
      age: 10,
      case_id_display: "1234abcd",
      id: "1234567",
      name: "Test user",
      owned_by: "aa",
      owned_by_agency_id: "aa",
      sex: "aa"
    })
  };

  beforeEach(() => {
    mountedComponent(<MatchedTraces {...props} />);
  });

  it("should render 1 <MatchedTracePanel /> component", () => {
    expect(screen.getByText("tracing_request.matches")).toBeInTheDocument();
  });
  
});
