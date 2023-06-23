import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import qs from "qs";
import { fromJS } from "immutable";
import omit from "lodash/omit";
import { useI18n } from "../../i18n";
import merge from "deepmerge";
import ActionDialog from "../../action-dialog";
import buildSelectedIds from "../utils/build-selected-ids";
import { useMemoizedSelector } from "../../../libs";
import { getMetadata } from "../../record-list/selectors";
import { getRecordsData } from "../../index-table";
import { linkToCase } from "../../records";
import { Search } from "../../index-filters/components/filter-types";
import { DEFAULT_FILTERS } from "../../record-list/constants";
import { NAME } from "./constants";
import IndexTable from "../../index-table";
import { fetchCasePotentialMatches, fetchLinkToCaseData } from "../../records";
const Component = ({ close, open, currentPage, selectedRecords, clearSelectedRecords, recordType }) => {
  console.log("recrdtype",recordType)
  const i18n = useI18n();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = qs.parse(location.search.replace("?", ""));
  const recordss = useMemoizedSelector(state => getRecordsData(state, recordType));
  const metadata = useMemoizedSelector(state => getMetadata(state, recordType));
  const defaultFilters = fromJS(Object.keys(queryParams).length ? queryParams : DEFAULT_FILTERS).merge(metadata);
  const selectedIds = buildSelectedIds(selectedRecords, recordss, currentPage, "id");
  const {...methods } = useForm();
  const handleOk = () => {
    dispatch(linkToCase({ recordType, incident_ids: selectedIds, case_id: "aee63810-0d34-4a28-addc-d0707eb13199" }));
    clearSelectedRecords();
  };
  const handleSubmit = useCallback(data => {
    // dispatch({
    //   type: GET_CASE_TO_LINK_INCIDENT,
    //   api: {
    //     path: "incidents/get_case_to_link",
    //     method: "GET",
    //     params: data
    //   }
    // });
    dispatch(fetchLinkToCaseData(data))
  }, [dispatch]);
  console.log(i18n.t("potential_match.case_id"), 'i18n', i18n.t("cases.age"))


  const tableOptions = {
    columns: [
      {
        name: "case.id",
        options: {
          display: false
        }
      },
      {
        label: i18n.t("potential_match.case_id"),
        name: "case.case_id_display"
      },
      {
        label: i18n.t("potential_match.child_age"),
        name: "case.age"
      },
    ],
    defaultFilters: fromJS({}),
    recordType: ["cases", "linkToCase"],
    targetRecordType: "cases",
    bypassInitialFetch: true,
    options: {
      selectableRows: "none",
      onCellClick: false,
      elevation: 0,
      pagination: false
    }
  };

  return (
  	<>
    <ActionDialog
      open={open}
      successHandler={handleOk}
      cancelHandler={close}
      dialogTitle={"Link to case"}
      dialogText={""}
      confirmButtonLabel={"Link"}
      omitCloseAfterSuccess>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Search />
        </form>
      </FormProvider>	
     <IndexTable {...tableOptions} />
    </ActionDialog>
    </>
  );
};

Component.defaultProps = {
  defaultFilters: fromJS({})
};

Component.displayName = NAME;

Component.propTypes = {
  clearSelectedRecords: PropTypes.func,
  close: PropTypes.func,
  currentPage: PropTypes.number,
  open: PropTypes.bool,
  recordType: PropTypes.string,
  selectedRecords: PropTypes.object,
  defaultFilters: PropTypes.object
};

export default Component;
