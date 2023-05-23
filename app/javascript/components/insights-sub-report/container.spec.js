import { Route } from "react-router-dom";
import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { setupMountedComponent } from "../../test";
import TableValues from "../charts/table-values";

import InsightsSubReport from "./container";
import { MemoryRouter } from "react-router-dom/cjs/react-router-dom.min";

describe("<InsightsSubReport />", () => {
  const initialState = {
    records: {
      insights: {
        selectedReport: {
          id: "violations",
          name: "managed_reports.violations.name",
          description: "managed_reports.violations.description",
          module_id: "primeromodule-mrm",
          subreports: ["killing", "maiming"],
          report_data: {
            killing: {
              data: {
                violation: [
                  {
                    group_id: "2022-Q2",
                    data: [
                      {
                        id: "boys",
                        total: 2
                      },
                      {
                        id: "girls",
                        total: 2
                      },
                      {
                        id: "total",
                        total: 5
                      }
                    ]
                  }
                ],
                perpetrators: [
                  {
                    group_id: "2022-Q2",
                    data: [
                      {
                        id: "armed_force_1",
                        boys: 1,
                        total: 2,
                        unknown: 1
                      }
                    ]
                  }
                ]
              },
              metadata: {
                display_graph: true,
                lookups: {
                  perpetrators: "lookup-armed-force-group-or-other-party",
                  violation: "lookup-violation-tally-options"
                },
                table_type: "default",
                order: ["violation", "perpetrators"]
              }
            }
          }
        },
        filters: {
          grouped_by: "quarter",
          date_range: "this_quarter",
          date: "incident_date",
          subreport: "detention"
        },
        loading: false,
        errors: false
      }
    },
    forms: {
      options: {
        lookups: [
          {
            id: 1,
            unique_id: "lookup-violation-tally-options",
            name: {
              en: "Violation Tally Options"
            },
            values: [
              {
                id: "boys",
                display_text: {
                  en: "Boys"
                }
              },
              {
                id: "girls",
                display_text: {
                  en: "Girls"
                }
              },
              {
                id: "total",
                display_text: {
                  en: "Total"
                }
              }
            ]
          },
          {
            id: 2,
            unique_id: "lookup-armed-force-group-or-other-party",
            name: {
              en: "Violation Tally Options"
            },
            values: [
              {
                id: "armed_force_1",
                display_text: {
                  en: "Armed Force 1"
                }
              }
            ]
          }
        ]
      }
    }
  };

  beforeEach(() => {
    
    mountedComponent(
        <MemoryRouter initialEntries={["/insights/primeromodule-mrm/violations/killing"]}>
          <Route
            path="/insights/:moduleID/:id/:subReport"
            render={(propsRoute) => (
              <InsightsSubReport {...propsRoute} initialState={initialState} />
            )}
          />
        </MemoryRouter>
      );
    


  });

  it("should render <InsightsSubReport /> component", () => {
    expect(screen.getByTestId("insights-subreport")).toBeInTheDocument();

});

  it("should render <h2 /> component", () => {
    // const title = screen.queryAllByText("managed_reports.violations.description");
    // expect(title).toBeTruthy();                                                        // it is also working 
    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toBeInTheDocument();
  
  });
  

  it("should render <TableValues /> component", () => {
    mountedComponent(<TableValues/> )
    expect(screen.getAllByRole("tableRow")).toBeTruthy();

  });

  it("should render <h3 /> component", () => {
    expect(screen.getAllByRole("heading")).toHaveLength(1);
  });
});