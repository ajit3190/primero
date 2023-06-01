import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
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
import { compactFilters,transformFilters } from "../../index-filters/utils";
import { overwriteMerge, useMemoizedSelector } from "../../../libs";
import { getMetadata } from "../../record-list/selectors";
import { getRecordsData } from "../../index-table";
import { linkToCase } from "../../records";
import { RECORD_TYPES_PLURAL } from "../../../config";
import { Search } from "../../index-filters/components/filter-types";
import { DEFAULT_FILTERS } from "../../record-list/constants";
import { NAME, FILTER_CATEGORY } from "./constants";
import { currentUser } from "../../user";
const Component = ({ close, open, recordType, currentPage, selectedRecords, clearSelectedRecords }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = qs.parse(location.search.replace("?", ""));
  const records = useMemoizedSelector(state => getRecordsData(state, recordType));
  const metadata = useMemoizedSelector(state => getMetadata(state, recordType));
  const defaultFilters = fromJS(Object.keys(queryParams).length ? queryParams : DEFAULT_FILTERS).merge(metadata);
  const selectedIds = buildSelectedIds(selectedRecords, records, currentPage, "id");
  const defaultFiltersPlainObject = defaultFilters.toJS();
  const [filterToList, setFilterToList] = useState(DEFAULT_FILTERS);
  const resetSelectedRecords = () => {
    setSelectedRecords(DEFAULT_SELECTED_RECORDS_VALUE);
  };
  const methods = useForm({
    defaultValues: merge({ ...defaultFiltersPlainObject, filter_category: FILTER_CATEGORY.incidents }, filterToList, {
      arrayMerge: overwriteMerge
    }),
    shouldUnregister: false
  });
  const userName = useMemoizedSelector(state => currentUser(state));

  const handleOk = () => {
    dispatch(linkToCase({ recordType, ids: selectedIds }));
    clearSelectedRecords();
  };
  const handleSubmit = useCallback(data => {
    const payload = omit(transformFilters.combine(compactFilters(data)), "filter_category");
console.log("ddddddddddddddddd",payload)
    resetSelectedRecords();
    dispatch(applyFilters({ recordType, data: payload }));
  }, []);

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
      <FormProvider {...methods} user={userName}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Search />
        </form>
      </FormProvider>	
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
