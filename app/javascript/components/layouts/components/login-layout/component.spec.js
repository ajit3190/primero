import { waitFor } from "@testing-library/react";
import { mountedComponent, screen } from "../../../../test-utils";

import LoginLayout from "./component";

describe("<LoginLayout />", () => {
  const state = {
    application: {
      demo: true,
      primero: {
        agencies: [
          {
            unique_id: 123
          }
        ]
      }
    }
  };
  
  it("renders default PrimeroModule logo", () => {
    mountedComponent(<LoginLayout />, state);
    
    expect(screen.getByAltText("Primero")).toBeInTheDocument();
  });

  it("renders translation toggle", () => {
    mountedComponent(<LoginLayout />, state);
    expect(screen.getByText('home.en')).toBeInTheDocument()
  });

  it("renders an agency logo",  () => {
    mountedComponent(<LoginLayout />, state);
      expect(document.querySelector('.agencyLogo')).toBeInTheDocument()

  });

});
