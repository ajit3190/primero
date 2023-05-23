import { mountedComponent, screen } from "test-utils";
import InsightsTableHeader from "./component";

describe("<InsightsTableHeader />", () => {
  const props = {
    addEmptyCell: true,
    columns: [
      {
        label: "2021",
        items: ["Q2", "Q3", "Q4"],
        subItems: ["boys", "girls", "unknown", "total"],
        colspan: 12
      },
      {
        label: "2022",
        items: ["Q1", "Q2"],
        subItems: ["boys", "girls", "unknown", "total"],
        colspan: 8
      }
    ]
  };
  beforeEach(() => {
    mountedComponent(<InsightsTableHeader {...props}/>)
  });

  it("should render <InsightsTableHeader /> component", () => {
    expect(screen.getByTestId('insights-table-header')).toBeInTheDocument();
  });

  it("should render <TableRow /> component", () => {
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });

  it("should render <TableCell /> component", () => {
    expect(screen.getAllByRole('cell')).toHaveLength(30);
  });

  it("should render <InsightsTableHeaderSubItems /> component", () => {
    expect(screen.getByTestId('insights-table-header-sub-items')).toBeInTheDocument();
  });
});
