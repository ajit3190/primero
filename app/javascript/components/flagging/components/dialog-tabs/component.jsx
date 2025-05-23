// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Tab, Tabs, Box } from "@mui/material";

import { useI18n } from "../../../i18n";
import TabPanel from "../TabPanel";
import css from "../styles.css";

import { NAME } from "./constants";

function Component({ children, isBulkFlags, tab, setTab }) {
  const i18n = useI18n();

  const tabs = [i18n.t("flags.flags_tab"), i18n.t("flags.add_flag_tab")];
  const filteredTabs = isBulkFlags ? tabs.filter(t => t !== i18n.t("flags.flags_tab")) : tabs;

  const a11yProps = index => {
    return {
      id: `flag-tab-${index}`,
      "aria-controls": `flag-tabpanel-${index}`
    };
  };

  const handleTabChange = (e, value) => {
    setTab(value);
  };

  const filterChildren = children.filter(child => ["false", undefined].includes(child.props.hidetab));

  const renderChildren = filterChildren.map((child, index) => (
    <TabPanel value={tab} index={index} key={`tab-${tabs[index]}`}>
      {child}
    </TabPanel>
  ));

  if (tabs) {
    return (
      <>
        <Box display="flex" className={css.containerTabs}>
          <Box flexGrow={1}>
            <Tabs onChange={handleTabChange} value={tab}>
              {filteredTabs.map((label, index) => (
                <Tab label={label} key={label} {...a11yProps(index)} className={css.flagTab} />
              ))}
            </Tabs>
          </Box>
        </Box>
        <div className={css.containerTabsBody}>{renderChildren}</div>
      </>
    );
  }

  return null;
}

Component.displayName = NAME;

Component.propTypes = {
  children: PropTypes.node.isRequired,
  isBulkFlags: PropTypes.bool.isRequired,
  setTab: PropTypes.func,
  tab: PropTypes.number
};

export default Component;
