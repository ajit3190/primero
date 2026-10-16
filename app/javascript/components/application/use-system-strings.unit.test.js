import { fromJS } from "immutable";

import { setupHook } from "../../test-utils";

import { useApp } from "./use-app";
import useSystemStrings from "./use-system-strings";
import { PrimeroModuleRecord } from "./records";

jest.mock("./use-app");

describe("application/use-system-string.js", () => {
  const state = {
    user: {
      isAuthenticated: true,
      username: "primero",
      modules: ["primeromodule-cp"]
    },
    application: {
      modules: [
        PrimeroModuleRecord({
          unique_id: "primeromodule-cp",
          name: "CP",
          associated_record_types: ["case", "tracing_request", "incident"],
          field_labels: {
            name: {
              en: "Name (from CP module)"
            }
          }
        })
      ],
      fieldLabels: {
        name: {
          en: "Name (from SYS Settings)"
        },
        "dashboard.case_risk": {
          en: "Risk Level (from SYS Settings)"
        }
      }
    }
  };

  beforeEach(() => {
    useApp.mockReturnValue({
      fieldLabels: fromJS({
        name: {
          en: "Name (from SYS Settings)"
        },
        "dashboard.case_risk": {
          en: "Risk Level (from SYS Settings)"
        }
      })
    });
  });

  it("returns label from module", () => {
    const { act, result } = setupHook(() => useSystemStrings("listHeader"), state);

    act(() => {
      expect(result.current.label("name")).toEqual("Name (from CP module)");
    });
  });

  it("returns fallback label from system settings", () => {
    const { act, result } = setupHook(() => useSystemStrings("dashboard"), state);

    act(() => {
      expect(result.current.label("dashboard.case_risk")).toEqual("Risk Level (from SYS Settings)");
    });
  });

  it("returns fallback label from i18n", () => {
    const { act, result } = setupHook(() => useSystemStrings("listHeader"), state);

    act(() => {
      expect(result.current.label("record_owner")).toEqual("record_owner");
    });
  });

  it("does not return unpermitted label and fallback to i18n", () => {
    const { act, result } = setupHook(() => useSystemStrings("listHeader"), state);

    act(() => {
      expect(result.current.label("unpermitted_field")).toEqual("unpermitted_field");
    });
  });

  it("returns specified i18n fallback", () => {
    const { act, result } = setupHook(() => useSystemStrings("listHeader"), state);

    act(() => {
      expect(result.current.label("record_owner", "fields.record_owner")).toEqual("fields.record_owner");
      expect(result.current.label("social_worker", "fields.social_worker")).toEqual("fields.social_worker");
    });
  });

  describe("registry record keys", () => {
    const registryLabels = {
      "navigation.registry_records": { en: "CBCRCs" },
      "registry_records.label": { en: "CBCRCs" },
      "registry_records.register_new_registry_record": { en: "New CBCRC" },
      "registry_records.show_registry_record": { en: "CBCRC ID: %{short_id}" },
      "registry_records.selected_records": { en: "%{select_records} CBCRC(s) selected" },
      "registry_records.selected_all_records": { en: "Select all %{total_records} CBCRCs that match this query." },
      "forms.record_types.registry_details": { en: "CBCRC Details" }
    };
    const registryState = {
      ...state,
      application: {
        ...state.application,
        modules: [
          PrimeroModuleRecord({
            unique_id: "primeromodule-cp",
            name: "CP",
            associated_record_types: ["case", "incident", "registry_record"],
            field_labels: registryLabels
          })
        ]
      }
    };

    it.each([
      ["navigation", "navigation.registry_records", {}, "CBCRCs"],
      ["page", "registry_records.label", {}, "CBCRCs"],
      ["page", "registry_records.register_new_registry_record", {}, "New CBCRC"],
      ["page", "registry_records.show_registry_record", { short_id: "abc1234" }, "CBCRC ID: abc1234"],
      ["page", "registry_records.selected_records", { select_records: 2 }, "2 CBCRC(s) selected"],
      [
        "page",
        "registry_records.selected_all_records",
        { total_records: 5 },
        "Select all 5 CBCRCs that match this query."
      ],
      ["form", "forms.record_types.registry_details", {}, "CBCRC Details"]
    ])("returns the %s override for %s", (feature, key, options, expected) => {
      const { act, result } = setupHook(() => useSystemStrings(feature), registryState);

      act(() => {
        expect(result.current.label(key, undefined, options)).toEqual(expected);
      });
    });
  });

  describe("incident keys", () => {
    const incidentLabels = {
      "dashboard.dash_case_incident_overview": { en: "My Cases / Monitoring Reports" },
      "navigation.incidents": { en: "Monitoring Reports" },
      "incidents.label": { en: "Monitoring Reports" },
      "incidents.show_incident": { en: "Monitoring Report ID %{short_id}" },
      "forms.record_types.incident": { en: "Monitoring Report" },
      "actions.incident_from_case": { en: "Create Monitoring Report" },
      "incident.link_incident_to_case": { en: "Link Monitoring Report to Case" }
    };
    const incidentState = {
      ...state,
      application: {
        ...state.application,
        modules: [
          PrimeroModuleRecord({
            unique_id: "primeromodule-cp",
            name: "CP",
            associated_record_types: ["case", "incident"],
            field_labels: incidentLabels
          })
        ]
      }
    };

    it.each([
      ["dashboard", "dashboard.dash_case_incident_overview", {}, "My Cases / Monitoring Reports"],
      ["navigation", "navigation.incidents", {}, "Monitoring Reports"],
      ["form", "incidents.label", {}, "Monitoring Reports"],
      ["page", "incidents.show_incident", { short_id: "abc1234" }, "Monitoring Report ID abc1234"],
      ["page", "forms.record_types.incident", {}, "Monitoring Report"],
      ["actionButton", "forms.record_types.incident", {}, "Monitoring Report"],
      ["actionButton", "actions.incident_from_case", {}, "Create Monitoring Report"],
      ["actionButton", "incident.link_incident_to_case", {}, "Link Monitoring Report to Case"]
    ])("returns the %s override for %s", (feature, key, options, expected) => {
      const { act, result } = setupHook(() => useSystemStrings(feature), incidentState);

      act(() => {
        expect(result.current.label(key, undefined, options)).toEqual(expected);
      });
    });

    it("does not override the incident list title", () => {
      const { act, result } = setupHook(() => useSystemStrings("page"), incidentState);

      act(() => {
        expect(result.current.label("incidents.label")).toEqual("incidents.label");
      });
    });
  });

  it("returns specified i18n fallback when unpermitted_field", () => {
    const { act, result } = setupHook(() => useSystemStrings("listHeader"), state);

    act(() => {
      expect(result.current.label("unpermitted_field", "fields.unpermitted_field")).toEqual("fields.unpermitted_field");
    });
  });
});
