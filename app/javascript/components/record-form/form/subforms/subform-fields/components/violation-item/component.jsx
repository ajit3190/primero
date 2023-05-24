import { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { ListItemText } from "@material-ui/core";
import ActionDialog from "../../../../../../action-dialog";

import ViolationTitle from "../violation-title";
import css from "../../../styles.css";

import { NAME } from "./constants";
import { getViolationTallyLabel } from "./utils";

import { Button } from "@material-ui/core";
import { saveRecord } from "../../../../../../records";
import { useParams} from 'react-router-dom';
import { usePermissions } from "../../../../../../permissions";
import { RECORD_ACTION_ABILITIES } from "../../../../../../record-actions/constants";


const Component = ({ fields, values, locale, displayName, index, collapsedFieldValues, mode }) => {
  const currentValues = values[index];
  const [selectedIndex, setSelectedIndex] = useState(null);
  const dispatch = useDispatch();
  const [verifyModal, setVerifyModal] = useState(false);
  const violationTally = getViolationTallyLabel(fields, currentValues, locale);
  const verifyParams = useParams();
  const handleOpenVerifyModal = (index,event) => {
    event.stopPropagation();
    setSelectedIndex(index);
    setVerifyModal(true);
  };

  const cancelVerifyHandler = () => {
    setVerifyModal(false);
    setSelectedIndex(null);
  };
  const {
    canVerify
  } = usePermissions("incidents", RECORD_ACTION_ABILITIES);

  const violationType = currentValues.type
  const handleOk = () => {
    dispatch(
      saveRecord(
        verifyParams.recordType,
        "update",
        {data: { [currentValues.type]: [ {  unique_id: currentValues.unique_id, ctfmr_verified: "verified" } ]}},
        verifyParams.id,
        "Verifed the case",
        "",
        false,
        false
      )
    );
    close();
  };


  return (

    <ListItemText
      id="subform-header-button"
      classes={{ primary: css.listText, secondary: css.listTextSecondary }}
      secondary={
        <div id="subform-violation-fields">
          {violationTally}
          <br />
          {collapsedFieldValues}
        </div> 
      }
    >
    { (currentValues.ctfmr_verified == "report_pending_verification" && canVerify && mode.isShow) ? 
        (<Button
          onClick={ (event) => handleOpenVerifyModal(index,event)}
          id={`verify-button-${name}-${index}`}
          className={css.verifiedSpan}
          color="primary"
          variant="contained"
          size="small"
          disableElevation>
          Verify
        </Button>)
        : null
      }
      <ViolationTitle title={displayName?.[locale]} values={currentValues} fields={fields} />

      <ActionDialog
         open={verifyModal}
         successHandler={handleOk}
         cancelHandler={cancelVerifyHandler}
         dialogTitle={"Verify"}
         dialogText={"Please verify case"}
         confirmButtonLabel={"OK"}
        />
    </ListItemText>
  );
};

Component.propTypes = {
  collapsedFieldValues: PropTypes.node,
  displayName: PropTypes.object,
  fields: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  locale: PropTypes.string.isRequired,
  values: PropTypes.array.isRequired,
  mode: PropTypes.object.isRequired
};

Component.displayName = NAME;

export default Component;
