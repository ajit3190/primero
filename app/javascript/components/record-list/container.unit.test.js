import chai, { expect } from "chai";
import { setupMountedComponent } from "test";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import React from "react";
import { Route } from "react-router-dom";
import { fromJS } from "immutable";
import { IndexTable } from "components/index-table";
import RecordList from "./container";
import { ViewModal } from "components/record-list/view-modal";
import * as Permissions from "libs/permissions";

chai.use(sinonChai);

describe("<RecordList />", () => {
  let component;

  beforeEach(() => {
    const initialState = fromJS({
      records: {
        FiltersTabs: {
          current: 0
        },
        cases: {
          data: [
            {
              id: "e15acbe5-9501-4615-9f43-cb6873997fc1",
              name: "Jose",
              record_state: true
            },
            {
              id: "7d55b677-c9c4-7c6c-7a41-bfa1c3f74d1c",
              name: "Carlos",
              record_state: true
            }
          ],
          metadata: { total: 2, per: 20, page: 1 },
          filters: {
            id_search: false,
            query: ""
          }
        }
      },
      user: {
        modules: ["primeromodule-cp"],
        listHeaders: {
          cases: [{ id: "name", name: "Name", field_name: "name" }]
        },
        permissions: { cases: [Permissions.MANAGE, Permissions.DISPLAY_VIEW_PAGE] }
      },
      application: {
        online: true,
        modules: [
          {
            unique_id: "primeromodule-cp",
            name: "CP",
            associated_record_types: ["case"]
          }
        ]
      }
    });

    const routedComponent = initialProps => {
      return (
        <Route
          path="/:recordType(cases|incidents|tracing_requests)"
          component={props => <RecordList {...{ ...props, ...initialProps }} />}
        />
      );
    };

    ({ component } = setupMountedComponent(routedComponent, {}, initialState, [
      "/cases"
    ]));
  });

  it("renders record list table", () => {
    expect(component.find(IndexTable)).to.have.length(1);
  });

  it("renders record list table", () => {
    expect(component.find(ViewModal)).to.have.lengthOf(1);
  });
});
