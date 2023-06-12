import { fromJS } from "immutable";

import { mountedComponent, screen } from "test-utils";

import { ACTIONS } from "../../../permissions";
import { FormAction } from "../../../form";

import AgenciesForm from "./container";

describe("<AgencyForm />", () => {
  let component;

  beforeEach(() => {
    const initialState = fromJS({
      records: {
        agencies: {
          data: [
            {
              id: "1",
              name: {
                en: "Agency 1"
              }
            },
            {
              id: "2",
              name: {
                en: "Agency 2"
              }
            }
          ],
          metadata: { total: 2, per: 20, page: 1 }
        }
      },
      user: {
        permissions: {
          agencies: [ACTIONS.MANAGE]
        }
      }
    });
    mountedComponent(<AgenciesForm mode={"new"} />,initialState, ["/admin/agencies"]);
   // ({ component } = setupMountedComponent(AgenciesForm, { mode: "new" }, initialState, ["/admin/agencies"]));
  });

  it("renders record form", () => {
    //expect(component.find("form")).to.have.length(1);
    expect(document.querySelector("#agency-form")).toBeInTheDocument();
  });

  xit("renders heading with action buttons", () => {
    expect(component.find("header h1").contains("agencies.label")).to.be.true;
    expect(component.find("header button").at(0).contains("agencies.translations.manage")).to.be.true;
    expect(component.find("header button").at(1).contains("buttons.cancel")).to.be.true;
    expect(component.find("header button").at(2).contains("buttons.save")).to.be.true;
  });

  
});
