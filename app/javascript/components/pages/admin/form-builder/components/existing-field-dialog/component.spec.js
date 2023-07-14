import { fromJS } from "immutable";

import { mountedComponent, screen, waitFor ,mountedFormComponent} from "test-utils";

import ExistingFieldDialog from "./component";
import { async } from "regenerator-runtime";

describe("<ExistingFieldDialog />", () => {
  const state = {
    ui: { dialogs: { admin_fields_dialog: true } },
    records: {
      admin: {
        forms: {
          selectedFields: [
            {
              id: 1,
              name: "field_1",
              display_name: { en: "Field 1" }
            },
            {
              id: 2,
              name: "field_2",
              display_name: { en: "Field 2" }
            }
          ]
        }
      }
    }
  };
  const props= { parentForm: "parent", primeroModule: "module-1" }

  it("should render the dialog",async () => {
    mountedFormComponent(<ExistingFieldDialog  parentForm = "parent" primeroModule= "module-1"/>, state);   
   
  
   await waitFor(() => expect(screen.getByTestId("test")).toBeInTheDocument());
   
  });
});
