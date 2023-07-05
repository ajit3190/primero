import { fromJS } from "immutable";


import FieldListItem from "../field-list-item";
import { mountedComponent, screen, waitFor } from "test-utils";
import FieldsList from "./component";

describe("<FieldsList />", () => {
  let component;

  const state = fromJS({
    records: {
      admin: {
        forms: {
          selectedFields: [
            { name: "field_1", display_name: { en: "Field 1" }, editable: false },
            { name: "field_2", display_name: { en: "Field 2" }, editable: true }
          ]
        }
      }
    }
  });

  beforeEach(() => { 
  const  props= { formContextFields: {} }
    mountedComponent(<FieldsList {...props} />, state);   
   
  });

  xit("should render the list items", () => {
   // expect(screen.getByText("test")).toBeInTheDocument();
    //expect(component.find(FieldListItem)).to.have.lengthOf(2);
  });
});
