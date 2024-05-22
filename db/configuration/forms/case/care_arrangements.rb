# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

care_arrangements_fields_subform = [
  Field.new('name' => 'child_caregiver_status',
            'type' => 'radio_button',
            'display_name_en' => 'Is this a same caregiver as was previously entered for the child?',
            'option_strings_source' => 'lookup lookup-yes-no',
            'visible' => false),
  Field.new('name' => 'child_caregiver_reason_change',
            'type' => 'select_box',
            'display_name_en' => 'If this is a new caregiver, give the reason for the change',
            'option_strings_source' => 'lookup lookup-caregiver-change-reason'),
  Field.new('name' => 'care_arrangements_include_referral_form',
            'type' => 'tick_box',
            'tick_box_label_en' => 'Yes',
            'display_name_en' => 'If this is the current caregiver, include in the Referral Details form?',
            'help_text_en' => 'Only include if the person being referred is a child'),
  Field.new('name' => 'care_arrangements_type',
            'type' => 'select_box',
            'display_name_en' => "What are the child's current care arrangements?",
            'option_strings_source' => 'lookup lookup-care-arrangements-type'),
  Field.new('name' => 'care_arrangements_type_other',
            'type' => 'text_field',
            'display_name_en' => 'If Other, please specify'),
  Field.new('name' => 'care_arrangements_type_notes',
            'type' => 'textarea',
            'display_name_en' => 'Care Arrangement Notes',
            'visible' => false),
  Field.new('name' => 'care_agency_name',
            'type' => 'text_field',
            'display_name_en' => 'Name of Agency Providing Care Arrangements',
            'visible' => false),
  Field.new('name' => 'name_caregiver_separator',
            'type' => 'separator',
            'display_name_en' => 'If not with parents, main person caring for the child.'),
  Field.new('name' => 'name_caregiver',
            'type' => 'text_field',
            'display_name_en' => 'Name of Current Caregiver',
            'help_text_en' => 'If the child is with the parents, proceed to Care Arrangements.'),
  Field.new('name' => 'nickname_caregiver',
            'type' => 'text_field',
            'display_name_en' => 'Other names or spellings caregiver is known by',
            'help_text_en' => 'e.g., nickname, second family name'),
  Field.new('name' => 'caregiver_age',
            'type' => 'numeric_field',
            'display_name_en' => "Caregiver's Age"),
  Field.new('name' => 'caregiver_dob',
            'type' => 'date_field',
            'display_name_en' => "Caregiver's Date of Birth (DOB)"),
  Field.new('name' => 'relationship_caregiver',
            'type' => 'select_box',
            'display_name_en' => 'Relationship to child',
            'option_strings_source' => 'lookup lookup-family-relationship'),
  Field.new('name' => 'care_arrangement_started_date',
            'type' => 'date_field',
            'display_name_en' => 'When did this care arrangement start?')
]

care_arrangements_section = FormSection.create_or_update!(
  'visible' => false,
  'is_nested' => true,
  :mobile_form => true,
  :order_form_group => 50,
  :order => 10,
  :order_subform => 1,
  :unique_id => 'care_arrangements_section',
  :parent_form => 'case',
  'editable' => true,
  :fields => care_arrangements_fields_subform,
  :initial_subforms => 1,
  'name_en' => 'Nested Care Arrangements',
  'description_en' => 'Care Arrangements Subform',
  'collapsed_field_names' => %w[care_arrangements_type name_caregiver care_arrangement_started_date]
)

care_arrangements_fields = [
  Field.new('name' => 'name_caregiver',
            'type' => 'text_field',
            'display_name_en' => 'Name of Caregiver',
            'visible' => false),
  Field.new('name' => 'current_care_arrangement_header',
            'type' => 'separator',
            'display_name_en' => 'Current Care Arrangement',
            'guiding_questions_en' => 'Primero automatically fills in the below fields with information from the most recent Care Arrangements subform entry'),
  Field.new('name' => 'current_name_caregiver',
            'type' => 'text_field',
            'display_name_en' => 'Name of Current Caregiver',
            'disabled' => true),
  Field.new('name' => 'current_care_arrangements_type',
            'type' => 'select_box',
            'display_name_en' => "What are the child's current care arrangements?",
            'option_strings_source' => 'lookup lookup-care-arrangements-type',
            'disabled' => true),
  Field.new('name' => 'current_care_arrangement_started_date',
            'type' => 'date_field',
            'display_name_en' => 'When did this care arrangement start?',
            'disabled' => true),
  Field.new('name' => 'care_arrangements_section',
            'type' => 'subform',
            'editable' => true,
            'subform_section' => care_arrangements_section,
            'display_name_en' => 'Care Arrangements')
]

FormSection.create_or_update!(
  unique_id: 'care_arrangements',
  parent_form: 'case',
  visible: true,
  order_form_group: 110,
  order: 10,
  order_subform: 0,
  form_group_id: 'services_follow_up',
  editable: true,
  fields: care_arrangements_fields,
  name_en: 'Care Arrangements',
  description_en: 'Care Arrangements'
)
