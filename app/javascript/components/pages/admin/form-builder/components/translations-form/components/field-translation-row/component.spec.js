// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mountedFormComponent, screen } from "../../../../../../../../test-utils";
import { localesToRender } from "../../../utils";

import FieldTranslationRow from "./component";

jest.mock("../../../utils");

describe("<FieldTranslationRow />", () => {
  const field1 = {
    name: "field_1",
    display_name: { en: "Field 1" }
  };
  const state = fromJS({
    application: { primero: { locales: ["en", "fr", "ar"] } },
    records: {
      admin: {
        forms: {
          selectedFields: [
            field1,
            {
              name: "field_2",
              display_name: { en: "Field 2" }
            }
          ]
        }
      }
    }
  });

  const props = { field: fromJS(field1), selectedLocaleId: "en" };

  it("should render <FieldTranslationRow />", () => {
    localesToRender.mockReturnValue([fromJS({ id: "en" })]);
    mountedFormComponent(<FieldTranslationRow {...props} />, state);
    expect(screen.getByText("forms.manage")).toBeInTheDocument();
  });

  it("should render the <FormSectionField /> for the available languages", () => {
    localesToRender.mockReturnValue([fromJS({ id: "en" })]);
    mountedFormComponent(<FieldTranslationRow {...props} />, state);
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
  });
});
