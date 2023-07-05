import { mountedComponent, screen } from "test-utils";

import TranslationsTab from "./component";

describe("<TranslationsTab />", () => {
  let component;

  beforeEach(() => {
    const props = { index: 1,
        tab: 1,
        formContextFields: {},
        fieldDialogMode: "new",
        moduleId: "module_1",
        parentForm: "parent" }

        mountedComponent(<TranslationsTab index="1" tab="1"
        //formContextFields={}
        fieldDialogMode= "new"
        moduleId= "module_1"
        parentForm= "parent"  />);
  });

  it("should render <SettingsTab />", () => {
    //expect(screen.getByText("test")).toBeInTheDocument();
   // expect(component.find(TranslationsTab)).to.have.lengthOf(1);
  });
});
