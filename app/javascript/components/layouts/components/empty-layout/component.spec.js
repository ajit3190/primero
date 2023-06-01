import { fromJS } from "immutable";

import SessionTimeoutDialog from "../../../session-timeout-dialog";
import { mountedComponent, screen } from "../../../../test-utils";

import EmptyLayout from "./component";

describe("layouts/components/<EmptyLayout />", () => {

  it("renders DemoIndicator component", () => {

    jest.mock("../../../application/use-app.jsx", () => {
      return {
        ...jest.requireActual("../../../application/use-app.jsx"),
        useApp: jest.fn().mockReturnValue({
          demo: true
        })
      };
    });   
     mountedComponent(<EmptyLayout />);
    expect(screen.getByText((content, element) => element.tagName.toLowerCase() === "div")).toBeInTheDocument()
  });
  it("renders SessionTimeoutDialog component", () => {
    jest.mock("../../../application/use-app.jsx", () => {
      return {
        ...jest.requireActual("../../../application/use-app.jsx"),
        useApp: jest.fn().mockReturnValue({
          demo: true
        })
      };
    });   
     mountedComponent(<EmptyLayout />);
    expect(screen.getByText((content, element) => element.tagName.toLowerCase() === "div")).toBeInTheDocument()
  });
});
