import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { useCallback, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import qs from "qs";
import { fromJS } from "immutable";
import omit from "lodash/omit";
import { useI18n } from "../../i18n";
import merge from "deepmerge";
import ActionDialog from "../../action-dialog";
import buildSelectedIds from "../utils/build-selected-ids";
import { useMemoizedSelector, dataToJS } from "../../../libs";
import { getMetadata } from "../../record-list/selectors";
import { getRecordsData, getRecords } from "../../index-table";
import { linkToCase } from "../../records";
import { Search } from "../../index-filters/components/filter-types";
import { DEFAULT_FILTERS } from "../../record-list/constants";
import { NAME } from "./constants";
import IndexTable from "../../index-table";
import { clearDialog } from "../../action-dialog/action-creators";
import { fetchCasePotentialMatches, fetchLinkToCaseData } from "../../records";

const Component = ({ close, open, currentPage, selectedRecords, clearSelectedRecords, recordType }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = qs.parse(location.search.replace("?", ""));
  const recordss = useMemoizedSelector(state => getRecordsData(state, recordType));
  const metadata = useMemoizedSelector(state => getMetadata(state, recordType));
  const defaultFilters = fromJS(Object.keys(queryParams).length ? queryParams : DEFAULT_FILTERS).merge(metadata);
  const selectedIds = buildSelectedIds(selectedRecords, recordss, currentPage, "id");
  const { ...methods } = useForm();
  const [selectedRows, setSelectedRecords] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState();
  const caseData = useMemoizedSelector(state => getRecords(state, "cases").get("data"));

  const handleOk = () => {
    dispatch(linkToCase({ recordType, incident_ids: selectedIds, case_id: selectedCaseId }));
    clearSelectedRecords();
    dispatch(fetchLinkToCaseData({}));
    dispatch(clearDialog());
  };

  const handleSubmit = useCallback(data => {
    // clearSelectedRecords();
    dispatch(fetchLinkToCaseData(data))
  }, []);

  const tableOptions = {
    columns: [
      {
        name: "case.id",
        options: {
          display: false
        }
      },
      {
        label: i18n.t("potential_match.name"),
        name: "name"
      },
      {
        label: i18n.t("potential_match.case_id"),
        name: "case_id_display"
      },
      {
        label: i18n.t("potential_match.child_age"),
        name: "age"
      },
      {
        label: i18n.t("potential_match.child_gender"),
        name: "sex"
      }
    ],
    defaultFilters: fromJS({}),
    recordType: "cases",
    targetRecordType: "cases",
    bypassInitialFetch: true,
    options: {
      selectableRows: "multiple",
      onCellClick: false,
      elevation: 0,
      pagination: false
    }
  };

  const onClose = () => {
    dispatch(fetchLinkToCaseData({}))
    close();
  };

  const handleSelectedRecords = (index) => {
    if (index[0].length === 1) {
      setSelectedRecords(index);
      const id = fetchIdFromPosition(index);
      setSelectedCaseId(id);
    }
  };

  const fetchIdFromPosition = (index) => {
    if (dataToJS(caseData) && dataToJS(caseData).length > index[0][0]) {
      const object = dataToJS(caseData)[index[0][0]];
      return object.id;
    }
    return null;
  };

  return (
    <>
      <ActionDialog
        open={open}
        successHandler={handleOk}
        cancelHandler={onClose}
        onClose={onClose}
        dialogTitle={"Link to case"}
        dialogText={""}
        confirmButtonLabel={"Link"}
        enabledSuccessButton={selectedCaseId !== undefined && selectedCaseId !== null ? true : false}
        omitCloseAfterSuccess>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <Search />
          </form>
        </FormProvider>
        <IndexTable {...tableOptions} selectedRecords={selectedRows} setSelectedRecords={(event) => { handleSelectedRecords(event) }} />
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
