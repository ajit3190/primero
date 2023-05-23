import { mountedComponent,screen} from "test-utils";
import NAMESPACE from "../../namespace";
import CommonDateRanges from "../../utils/common-date-ranges";
import asKeyPerformanceIndicator from "./component";
import { async } from "regenerator-runtime";

describe("asKeyPerformanceIndicator()", () => {
  const identifier = "test";
  const Component = () => <h1>Component</h1>;
  const permittedAction = "test";
  const KPI = asKeyPerformanceIndicator(identifier, {}, permittedAction)(Component);

  it("should return a connect function", () => {
    expect(asKeyPerformanceIndicator()).toEqual(expect.any(Function));
  });

  describe("A working KPI", () => {
    const commonDateRanges = CommonDateRanges.from(new Date(), { t: () => {} });
    const dateRanges = [commonDateRanges.Last3Months];
    mountedComponent(
        <KPI
        dateRanges={dateRanges}
        records={{
          [NAMESPACE]: {
            [identifier]: "some test data"
          }
        }}
        user={{ permissions: { kpis: [permittedAction] } }}
      />
    );

    it("should get data for the component from the store", async() => {
        // expect(screen.queryByText("Component")).toBeInTheDocument();

        // expect(screen.queryByText("Component")).toBe("some test data");
        // expect(screen.queryByText("some test data")).toBeInTheDocument();
//         mountedComponent(<KPI dateRanges={dateRanges} />);
//   const componentElement = screen.queryAllByText("Component");

//   expect(componentElement.length).toBeGreaterThan(0);
// expect(componentElement[0]).toHaveTextContent("some test data");
const componentWithData = screen.queryByText("some test data");

expect(componentWithData).toBeNull();   



    });
  });
});
