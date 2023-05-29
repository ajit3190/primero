import { mountedComponent, screen } from "test-utils";

import TablePercentageBar from "./component";

describe("<TablePercentageBar /> components/TablePercentageBar", () => {
  it("renders a <TablePercentageBar /> component", () => {
    const newProps = {
      percentage: 0.5
    };

    mountedComponent(<TablePercentageBar {...newProps} />);
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("should display the percentage outside of the bar", () => {
    mountedComponent(<TablePercentageBar percentage={0.01} />);

    expect(screen.getByText("1%")).toBeInTheDocument();
  });
});
