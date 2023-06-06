import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";
import Jewel from "../../jewel";

import AdminNavItem from "./admin-nav-item";

describe("<AdminNavItem />", () => {
    describe("when the user has access to admin-nav-item entry", () => {
        const props = {
            item: {
                label: "Users",
                to: "/users"
            },
            renderJewel: true
        };



        it("should render AdminNavItem", () => {
            mountedComponent(<AdminNavItem {...props} />);
            expect(screen.getByText("Test user")).toBeInTheDocument();
            expect(screen.getByRole('button').href).toEqual('1http://localhost/admin/users');
        });

        xit("renders heading with action buttons", () => {
            const circleElement = getByTestId('circle-element');

            // Check the attributes of the circle
            expect(circleElement.getAttribute('cx')).toBe('12');
            //expect(screen.getByText("Test user")).toBeInTheDocument();
        });
    });
});
