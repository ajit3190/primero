// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getIn } from "formik";
import clsx from "clsx";
import { List } from "@material-ui/core";

import SubformFields from "../subform-fields";
import SubformEmptyData from "../subform-empty-data";
import SubformItem from "../subform-item";
import SubformAddEntry from "../subform-add-entry";
import { SUBFORM_FIELD_ARRAY } from "../constants";
import { VIOLATIONS_ASSOCIATIONS_FORM } from "../../../../../config";
import css from "../styles.css";
import { isFamilyDetailSubform, isFamilyMemberSubform, isViolationSubform } from "../../utils";
import { GuidingQuestions } from "../../components";
import { ConditionalWrapper, displayNameHelper } from "../../../../../../javascript/libs";
import { isEmptyOrAllDestroyed, isTracesSubform } from "./utils";

const Component = ({
  arrayHelpers,
  field,
  formik,
  i18n,
  mode,
  formSection,
  recordModuleID,
  recordType,
  form,
  isReadWriteForm,
  forms,
  parentTitle,
  parentValues,
  violationOptions,
  renderAsAccordion = false,
  entryFilter = false,
  customTitle = false
}) => {
  const {
    display_name: displayName,
    name,
    subform_section_configuration: subformSectionConfiguration,
    disabled: isDisabled,
    guiding_questions: guidingQuestions
  } = field;
  // eslint-disable-next-line camelcase
  const displayConditions = subformSectionConfiguration?.display_conditions;

  const orderedValues = getIn(formik.values, name);

  const [openDialog, setOpenDialog] = useState({ open: false, index: null });
  const [dialogIsNew, setDialogIsNew] = useState(false);
  const [selectedValue, setSelectedValue] = useState({});

  const { open, index } = openDialog;

  const title = customTitle || displayName?.[i18n.locale] || displayName?.[i18n.defaultLocale];

  const isTraces = isTracesSubform(recordType, formSection);

  const isFamilyDetail = isFamilyDetailSubform(recordType, formSection.unique_id);
  const isFamilyMember = isFamilyMemberSubform(recordType, formSection.unique_id);
  const isViolation = isViolationSubform(recordType, formSection.unique_id, true);
  const isViolationAssociation = VIOLATIONS_ASSOCIATIONS_FORM.includes(formSection.unique_id);
  const renderAddFieldTitle = !isViolation && !mode.isShow && !displayConditions && i18n.t("fields.add");

  const cssContainer = clsx(css.subformFieldArrayContainer, {
    [css.subformFieldArrayAccordion]: renderAsAccordion && mode.isShow,
    [css.subformFieldArrayShow]: renderAsAccordion && !mode.isShow
  });

  useEffect(() => {
    if (typeof index === "number") {
      setSelectedValue(orderedValues[index]);
    }
  }, [index]);

  const renderEmptyData = isEmptyOrAllDestroyed(orderedValues) ? (
    <SubformEmptyData subformName={title} />
  ) : (
    <List dense={renderAsAccordion} classes={{ root: css.list }} disablePadding>
      <SubformFields
        arrayHelpers={arrayHelpers}
        field={field}
        values={orderedValues}
        locale={i18n.locale}
        mode={mode}
        setOpen={setOpenDialog}
        setDialogIsNew={setDialogIsNew}
        form={formSection}
        recordType={recordType}
        isTracesSubform={isTraces}
        isViolationSubform={isViolation}
        isViolationAssociation={isViolationAssociation}
        formik={formik}
        parentForm={form}
        entryFilter={entryFilter}
        parentTitle={parentTitle}
        isFamilyMember={isFamilyMember}
        isFamilyDetail={isFamilyDetail}
      />
    </List>
  );

  const renderGuidingQuestions = guidingQuestions && guidingQuestions[i18n.locale] && (mode.isEdit || mode.isNew) && (
    <div className={css.subformGuidance}>
      <GuidingQuestions label={i18n.t("buttons.guidance")} text={guidingQuestions[i18n.locale]} />
    </div>
  );
{console.log("orderedValues----..",)}
if(orderedValues ){}
  const latestValue = orderedValues[orderedValues.length - 1]
  const fieldMappings = [
    { label: "Age", key: "cfm_age" },
    { label: "Vision wear glass", key: `cfm_${latestValue?.cfm_age}_vision_wears_glasses` },
    { label: "Difficulty seeing with glasses", key: `cfm_${latestValue?.cfm_age}_vision_difficulty_with_glasses` },
    { label: "The child wears hearing aid", key: `cfm_${latestValue?.cfm_age}_hearing_uses_hearing_aid` },
    { label: "Difficulty hearing with hearing aid", key: `cfm_${latestValue?.cfm_age}_hearing_difficulty_with_hearing_aid` },
    { label: "The child uses equipment or receive assistance for walking", key: `cfm_${latestValue?.cfm_age}_mobility_uses_equipment` },
    { label: "Difficulty walking without equipment/assistance", key: `cfm_${latestValue?.cfm_age}_mobility_difficulty_without_equipment` },
    { label: "Difficulty walking with equipment/assistance", key: `cfm_${latestValue?.cfm_age}_learning_difficulty` },
    { label: "Difficulty picking up small objects with hand", key: `cfm_${latestValue?.cfm_age}_dexterity_difficulty` },
    { label: "The child have difficulty to understand", key: `cfm_${latestValue?.cfm_age}_communication_difficulty_understanding_you` },
    { label: "Difficulty to understand the child", key: `cfm_${latestValue?.cfm_age}_communication_difficulty_understanding_child` },
    { label: "The child have difficulty for Learning", key: `cfm_${latestValue?.cfm_age}_learning_difficulty` },
    { label: "The child have difficulty for playing", key: `cfm_${latestValue?.cfm_age}_playing_difficulty` },
    { label: "Difficulty for controlling behaviour like kick,bite or hit others", key: `cfm_${latestValue?.cfm_age}_controlling_behavior_difficulty` },
];

  const beautifyKey = (key) => {
    return key
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  };

  const beautifyValue = (key, value) => {
    if (typeof value === "string") {
      // Convert "true" to "Yes" and "false" to "No"
      if (value === "true") {
        return "Yes";
      }
      if (value === "false") {
        return "No";
      }
      // Convert age range like "2_4" to "2 to 4 years"
      if (key.includes("age") && value.includes("_")) {
        return value.replace("_", " to ") + " years";
      }
      // Beautify special cases like 'cannot_do_at_all'
      if (value.includes("_")) {
        return value
          .replace(/_/g, " ") // Replace underscores with spaces
          .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
      }
      // If it's a date string, format it
      if (!isNaN(Date.parse(value))) {
        return new Date(value).toLocaleDateString();
      }
      // Return the value as it is otherwise
      return value;
    }
    return value; // Handle non-string values (e.g., numbers)
  };




  return (
    <div className={css.fieldArray}>
      <h3 className={css.subformTitle}>
        Summary
      </h3>
      {latestValue !== null && latestValue !== undefined ? (
      fieldMappings.map((field) => {
        const value = latestValue[field.key];
        {console.log("value--->>",value)}
        // Skip rendering if the value is null, undefined, or "N/A"
        if (value === null || value === undefined || value === "N/A") return null
        else{
        return (
          <div key={field.key} style={{ marginBottom: "4px" }}>
            <strong>{beautifyKey(field.label)}:</strong> {beautifyValue(field.key, value)}
          </div>
        )}
      })) : null}

      <div className={cssContainer}>
        {!renderAsAccordion && (
          <div>
            <h3 className={css.subformTitle}>
              {renderAddFieldTitle} {title} {parentTitle}
            </h3>
          </div>
        )}
        <SubformAddEntry
          field={field}
          formik={formik}
          mode={mode}
          formSection={formSection}
          isReadWriteForm={isReadWriteForm}
          isDisabled={isDisabled}
          setOpenDialog={setOpenDialog}
          setDialogIsNew={setDialogIsNew}
          isViolationAssociation={isViolationAssociation}
          parentTitle={parentTitle}
          parentValues={parentValues}
          arrayHelpers={arrayHelpers}
        />
      </div>
      {console.log("divyanshu", orderedValues)}
      {renderGuidingQuestions}
      {renderEmptyData}

      <SubformItem
        arrayHelpers={arrayHelpers}
        dialogIsNew={dialogIsNew}
        field={field}
        formik={formik}
        forms={forms}
        formSection={formSection}
        index={index}
        isDisabled={isDisabled}
        isTraces={isTraces}
        isReadWriteForm={isReadWriteForm}
        isViolation={isViolation}
        isViolationAssociation={isViolationAssociation}
        isFamilyMember={isFamilyMember}
        isFamilyDetail={isFamilyDetail}
        mode={mode}
        selectedValue={selectedValue}
        open={open}
        orderedValues={orderedValues}
        recordModuleID={recordModuleID}
        recordType={recordType}
        setOpen={setOpenDialog}
        title={title}
        parentTitle={parentTitle}
        violationOptions={violationOptions}
      />
    </div>
  );
};

Component.displayName = SUBFORM_FIELD_ARRAY;

Component.propTypes = {
  arrayHelpers: PropTypes.object.isRequired,
  customTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  entryFilter: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  forms: PropTypes.object.isRequired,
  formSection: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  isReadWriteForm: PropTypes.bool,
  mode: PropTypes.object.isRequired,
  parentTitle: PropTypes.string,
  parentValues: PropTypes.object,
  recordModuleID: PropTypes.string.isRequired,
  recordType: PropTypes.string.isRequired,
  renderAsAccordion: PropTypes.bool,
  violationOptions: PropTypes.array
};

export default Component;
