# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Configures the behavior of a module of Primero
class PrimeroModule < ApplicationRecord
  include ConfigurationRecord

  CP = 'primeromodule-cp'
  GBV = 'primeromodule-gbv'
  MRM = 'primeromodule-mrm'

  CP_DEFAULT_CASE_LIST_FILTERS = %w[flagged owned_by my_cases workflow owned_by_agency_id status
                                    age sex approval_status_assessment approval_status_case_plan approval_status_closure
                                    approval_status_action_plan approval_status_gbv_closure protection_concerns
                                    protection_status urgent_protection_concern type_of_risk risk_level
                                    location_current reporting_location last_updated_by cases_by_date
                                    record_state has_photo].freeze
  GBV_DEFAULT_CASE_LIST_FILTERS = %w[flagged owned_by my_cases workflow owned_by_agency_id status
                                     age sex approval_status_assessment approval_status_case_plan
                                     approval_status_closure approval_status_action_plan approval_status_gbv_closure
                                     protection_concerns gbv_displacement_status
                                     owned_by_agency_office owned_by_groups last_updated_by record_state].freeze
  MRM_DEFAULT_CASE_LIST_FILTERS = %w[flagged owned_by my_cases workflow owned_by_agency_id status
                                     age sex approval_status_assessment approval_status_case_plan
                                     approval_status_closure approval_status_action_plan approval_status_gbv_closure
                                     protection_concerns last_updated_by record_state].freeze

  DEFAULT_CONSENT_FORM = 'consent'

  # allow_searchable_ids: TODO document
  # selectable_approval_types: TODO document
  # agency_code_indicator: TODO document. Still used?
  # workflow_status_indicator: Boolean. Show the workflow status bar for cases.
  # use_workflow_case_plan: Boolean. Case plan is a status in the workflow bar.
  # use_workflow_assessment: Boolean. Assessment is a status in the workflow bar.
  # use_workflow_service_implemented: Boolean. Workflow status bar indicates status when all services are implemented.
  # reporting_location_filter: TODO document
  # user_group_filter: TODO document
  # use_webhooks_for: String array of record types that can register webhooks.
  # use_webhook_sync_for: String array of record types that allow reverse syncs from downstream systems.
  store_accessor(
    :module_options,
    :allow_searchable_ids, :selectable_approval_types,
    :workflow_status_indicator, :agency_code_indicator, :use_workflow_service_implemented,
    :use_workflow_case_plan, :use_workflow_assessment, :reporting_location_filter,
    :user_group_filter, :use_webhooks_for, :use_webhook_sync_for, :consent_form,
    :list_filters
  )

  belongs_to :primero_program, optional: true
  has_and_belongs_to_many :form_sections, inverse_of: :primero_modules
  has_and_belongs_to_many :roles, -> { distinct }

  validates :name, presence: { message: I18n.t('errors.models.primero_module.name_present') },
                   uniqueness: { message: I18n.t('errors.models.primero_module.unique_name') }
  validates_presence_of :associated_record_types,
                        message: I18n.t('errors.models.primero_module.associated_record_types')

  before_create :set_unique_id, :set_consent_form
  after_save :sync_forms

  def program_name
    primero_program.try(:name)
  end

  def associated_forms(include_subforms = false)
    result = form_sections
    result.each { |f| f.module_name = name }
    result.reject(&:is_nested) unless include_subforms
    result
  end

  def associated_forms_grouped_by_record_type(include_subforms = false)
    forms = associated_forms(include_subforms)
    return {} if forms.blank?

    forms.each { |f| f.module_name = name }
    forms.group_by(&:parent_form)
  end

  def core_resource
    [CP, GBV, MRM].include?(id)
  end

  def self.cp
    find_by(unique_id: CP)
  end

  def self.gbv
    find_by(unique_id: GBV)
  end

  def self.mrm
    find_by(unique_id: MRM)
  end

  def self.available_module_ids
    all.pluck(:unique_id)
  end

  def form_section_unique_ids
    form_sections.pluck(:unique_id)
  end

  def update_with_properties(params)
    assign_attributes(params.except('form_section_unique_ids'))
    self.form_sections = FormSection.where(unique_id: params[:form_section_unique_ids])
  end

  # rubocop:disable Metrics/MethodLength
  def record_list_filters
    filters = {}
    filters_from_module = list_filters&.[](Child.table_name)

    filters[Child.table_name.to_sym] = case unique_id
                                       when GBV
                                         filters_from_module || GBV_DEFAULT_CASE_LIST_FILTERS
                                       when MRM
                                         filters_from_module || MRM_DEFAULT_CASE_LIST_FILTERS
                                       else
                                         filters_from_module || CP_DEFAULT_CASE_LIST_FILTERS
                                       end
    filters
  end
  # rubocop:enable Metrics/MethodLength

  private

  def set_unique_id
    return if unique_id.present?

    self.unique_id = "#{self.class.name}-#{name}".parameterize.dasherize
  end

  def set_consent_form
    self.consent_form ||= DEFAULT_CONSENT_FORM
  end

  def sync_forms
    return if form_sections.blank?

    subforms = []
    form_sections.each do |form_section|
      next if form_section.is_nested

      subforms += form_section.subforms
    end

    self.form_sections = form_sections | subforms
  end
end
