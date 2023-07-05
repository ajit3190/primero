
import { fromJS } from "immutable";

import { mountedComponent, screen } from "test-utils";
import MUIDataTable from "mui-datatables";

import { FieldRecord, FormSectionRecord } from "../../../../../../../form/records";
import { mapEntriesToRecord } from "../../../../../../../../libs";
import { setupMockFormComponent } from "../../../../../../../../test";

import FieldsTable from "./component";

describe("<FieldsTable />", () => {
  const fields = {
    1: {
      id: 1,
      name: "field_1",
      display_name: { en: "Field 1 " },
      form_section_id: 1
    },
    2: {
      id: 2,
      name: "field_2",
      display_name: { en: "Field 10 " },
      form_section_id: 1
    },
    3: {
      id: 3,
      name: "field_3",
      display_name: { en: "Field 3 " },
      form_section_id: 2
    },
    4: {
      id: 1,
      name: "field_4",
      display_name: { en: "Field 4 " },
      form_section_id: 3
    }
  };
  const formSections = {
    1: {
      id: 1,
      unique_id: "form_1",
      parent_form: "parent",
      module_ids: ["module-1"],
      fields: [1, 2]
    },
    2: {
      id: 2,
      unique_id: "form_2",
      parent_form: "parent",
      module_ids: ["module-1"],
      fields: [3]
    },
    3: {
      id: 3,
      unique_id: "form_3",
      parent_form: "parent",
      module_ids: ["module-2"],
      fields: [4]
    }
  };
  const selectedFields = [
    {
      id: 1,
      name: "field_1",
      display_name: { en: "Field 1" }
    },
    {
      id: 3,
      name: "field_3",
      display_name: { en: "Field 3" }
    }
  ];

  const state = fromJS({
    ui: { dialogs: { admin_fields_dialog: true } },
    records: {
      admin: {
        forms: {
          formSections: mapEntriesToRecord(formSections, FormSectionRecord),
          fields: mapEntriesToRecord(fields, FieldRecord)
        }
      }
    }
  });

  it("should render the table", () => {

    const props= {
        fieldQuery: "",
        parentForm: "parent",
        primeroModule: "module-1",
        addField: () => {},
        removeField: () => {}
      }

      mountedComponent(<FieldsTable  {...props}/>, state);   
      //expect(screen.getByText("ExistingFieldDialog")).toBeInTheDocument();

    //expect(component.find(FieldsTable)).to.have.lengthOf(1);
    //expect(component.find(FieldsTable).find(MUIDataTable).find("tbody").find("tr")).to.have.lengthOf(3);
  });

 
});
