import { mountedComponent, screen } from "test-utils";
import FieldsList from "../fields-list";

import FieldsTab from "./component";

describe("<FieldsTab />", () => {
    let component;

    beforeEach(() => {
        const props = { index: 1, tab: 1, formContextFields: {}, fieldDialogMode: "new" }
        mountedComponent(<FieldsTab {...props} />);
    });

    it("should render <FieldsTab />", () => {
        expect(screen.getByText("test")).toBeInTheDocument();
        //expect(component.find(FieldsTab)).to.have.lengthOf(1);
    });

    xit("should render <FieldsList />", () => {
        expect(component.find(FieldsList)).to.have.lengthOf(1);
    });
});
