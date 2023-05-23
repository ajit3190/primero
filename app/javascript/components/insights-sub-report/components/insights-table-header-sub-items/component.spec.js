import InsightsTableHeaderSubItems from "./component";
import { mountedComponent, screen } from "test-utils";

describe("<InsightsTableHeaderSubItems />", () => {
  let component;
  const props = {
    addEmptyCell: true,
    groupedSubItemcolumns: {
      "2021-Q2": ["boys", "girls", "unknown", "total"],
      "2021-Q3": ["boys", "girls", "unknown", "total"],
      "2021-Q4": ["boys", "girls", "unknown", "total"]
    }
  };

  beforeEach(() => {
   mountedComponent(<InsightsTableHeaderSubItems  {...props}/>)
  });

  it("should render <InsightsTableHeader /> component", () => {
    expect(screen.getByTestId('insights-table-header-sub-items')).toBeInTheDocument();
  });

  it("should render <TableRow /> component", () => {
    expect(screen.getByRole('row')).toBeInTheDocument();
  });

  it("should render <TableCell /> component", () => {
    expect(screen.getAllByRole('cell')).toHaveLength(13);
  });

  
});
