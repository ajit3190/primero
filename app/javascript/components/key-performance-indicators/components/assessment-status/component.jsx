// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";
import StackedPercentageBar from "../stacked-percentage-bar";
import asKeyPerformanceIndicator from "../as-key-performance-indicator";
import { ACTIONS } from "../../../permissions";

function Component({ data, identifier }) {
  const i18n = useI18n();

  return (
    <StackedPercentageBar
      percentages={[
        {
          percentage: data.get("data").get("completed"),
          label: i18n.t(`key_performance_indicators.${identifier}.completed`)
        }
      ]}
    />
  );
}

Component.displayName = "AssessmentStatus";

Component.propTypes = {
  data: PropTypes.object,
  identifier: PropTypes.string
};

export default asKeyPerformanceIndicator(
  "assessment_status",
  { data: { completed: 0 } },
  ACTIONS.KPI_ASSESSMENT_STATUS
)(Component);
