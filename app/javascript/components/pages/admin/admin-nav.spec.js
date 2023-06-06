import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import AdminNav from "./admin-nav";
import AdminNavItem from "./admin-nav-item";

describe("<AdminNav />", () => {
    describe("when the user has access to all admin-nav entries", () => {
        const state = fromJS({
            user: {
                permissions: {
                    agencies: ["manage"],
                    audit_logs: ["manage"],
                    cases: ["manage"],
                    dashboards: ["dash_reporting_location", "dash_protection_concerns"],
                    duplicates: ["read"],
                    incidents: ["manage"],
                    matching_configurations: ["manage"],
                    metadata: ["manage"],
                    potential_matches: ["read"],
                    reports: ["manage"],
                    roles: ["manage"],
                    systems: ["manage"],
                    tracing_requests: ["manage"],
                    user_groups: ["manage"],
                    users: ["manage"],
                    primero_configurations: ["manage"],
                    codes_of_conduct: ["manage"]
                }
            }
        });


        it("should render AdminNav component", () => {
            mountedComponent(<AdminNav />, state);
            expect(screen.getByText("test")).toBeInTheDocument();
        });

        xit("should renders all AdminNavItem menus", () => {
            
          });

    });


});
