import { mountedComponent,screen} from "test-utils";
import { ACTIONS } from "../permissions";
import KeyPerformanceIndicators from "./component";
describe("<KeyPerformanceIndicators />", () => {
  mountedComponent(
    <KeyPerformanceIndicators/>
    ,({
        user: {
          permissions: {
            kpis: [
              ACTIONS.KPI_ASSESSMENT_STATUS,
              ACTIONS.KPI_AVERAGE_FOLLOWUP_MEETINGS_PER_CASE,
              ACTIONS.KPI_AVERAGE_REFERRALS,
              ACTIONS.KPI_CASE_CLOSURE_RATE,
              ACTIONS.KPI_CASE_LOAD,
              ACTIONS.KPI_CLIENT_SATISFACTION_RATE,
              ACTIONS.KPI_COMPLETED_CASE_ACTION_PLANS,
              ACTIONS.KPI_COMPLETED_CASE_SAFETY_PLANS,
              ACTIONS.KPI_COMPLETED_SUPERVISOR_APPROVED_CASE_ACTION_PLANS,
              ACTIONS.KPI_GOAL_PROGRESS_PER_NEED,
              ACTIONS.KPI_NUMBER_OF_CASES,
              ACTIONS.KPI_NUMBER_OF_INCIDENTS,
              ACTIONS.KPI_REPORTING_DELAY,
              ACTIONS.KPI_SERVICES_PROVIDED,
              ACTIONS.KPI_SUPERVISOR_TO_CASEWORKER_RATIO,
              ACTIONS.KPI_TIME_FROM_CASE_OPEN_TO_CLOSE
            ]
          }
        }
      })     
    
);

  it("should render the NumberOfCases KPI", () => {
    expect(screen.queryAllByRole("NumberOfCases")).toBeTruthy()
  });

  it("should render the NumberOfIncidents KPI", () => {
    expect(screen.queryAllByRole("NumberOfIncidents")).toBeTruthy();
  });

  it("should render the ReportingDelay KPI", () => {
    expect(screen.queryAllByRole("ReportingDelay")).toBeTruthy();
  });

  it("should render the AssessmentStatus KPI", () => {
    expect(screen.queryAllByRole("AssessmentStatus")).toBeTruthy();
  });

  it("should render the CompletedCaseSafetyPlan KPI", () => {
    expect(screen.queryAllByRole("CompletedCaseSafetyPlan")).toBeTruthy();
  });

  it("should render the CompletedCaseActionPlan KPI", () => {
    expect(screen.queryAllByRole("CompletedCaseActionPlan")).toBeTruthy();
  });

  it("should render the CompletedSupervisorApprovedCaseActionPlan KPI", () => {
    expect(screen.queryAllByRole("CompletedSupervisorApprovedCaseActionPlan")).toBeTruthy();
  });

  it("should render the ServicesProvided KPI", () => {
    expect(screen.queryAllByRole("ServicesProvided")).toBeTruthy();
  });

  it("should render the AverageReferrals KPI", () => {
    expect(screen.queryAllByRole("AverageReferrals")).toBeTruthy();
  });

  it("should render the AverageFollowupMeetingsPerCase KPI", () => {
    expect(screen.queryAllByRole("AverageFollowupMeetingsPerCase")).toBeTruthy();
  });

  it("should render the TimeFromCaseOpenToClose KPI", () => {
    expect(screen.queryAllByRole("TimeFromCaseOpenToClose")).toBeTruthy();
  });

  it("should render the CaseClosureRate KPI", () => {
    expect(screen.queryAllByRole("CaseClosureRate")).toBeTruthy();
  });

  it("should render the ClientSatisfactionRate KPI", () => {
    expect(screen.queryAllByRole("ClientSatisfactionRate")).toBeTruthy();
  });

  it("should render the SupervisorToCaseworkerRatio KPI", () => {
    expect(screen.queryAllByRole("SupervisorToCaseworkerRatio")).toBeTruthy();
  });

  it("should render the CaseLoad KPI", () => {
    expect(screen.queryAllByRole("CaseLoad")).toBeTruthy();
    });
});

