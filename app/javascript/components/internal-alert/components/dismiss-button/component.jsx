import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import PropTypes from "prop-types";

import css from "./styles.css";

const Component = ({ handler }) => {
  const handlerWrapper = event => {
    event.stopPropagation();
    handler();
  };

  return (
    <IconButton className={css.dismissButton} onClick={handlerWrapper}>
      <CloseIcon />
    </IconButton>
  );
};

Component.displayName = "InternalAlertDismissButton";
Component.propTypes = {
  handler: PropTypes.func.isRequired
};
export default Component;
