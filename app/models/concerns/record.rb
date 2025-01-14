# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# A shared concern for all core Primero record types: Cases (child), Incidents, Tracing Requests
module Record
  extend ActiveSupport::Concern

  STATUS_OPEN = 'open'
  STATUS_CLOSED = 'closed'
  STATUS_TRANSFERRED = 'transferred'

  included do
    store_accessor :data, :unique_identifier, :short_id, :record_state, :status, :marked_for_mobile

    # Indicates if the update was performed through the API.
    attribute :record_user_update, :boolean

    after_initialize :defaults, unless: :persisted?
    before_create :create_identification
    before_save :save_cfm_summary
    before_save :populate_subform_ids
    after_save :index_nested_reportables
    after_destroy :unindex_nested_reportables
  end

  def self.model_from_name(name)
    case name
    when 'case' then Child
    when 'violation' then Incident
    else Object.const_get(name.camelize)
    end
  rescue NameError
    nil
  end

  def self.map_name(name)
    name = name.underscore
    name == 'child' ? 'case' : name
  end

  # Class methods for all Record types
  module ClassMethods
    def new_with_user(user, data = {})
      new.tap do |record|
        id = data.delete('id') || data.delete(:id)
        record.id = id if id.present?
        record.data = RecordMergeDataHashService.merge_data(record.data, data)
        record.creation_fields_for(user)
        record.owner_fields_for(user)
        record.record_user_update = true
      end
    end

    def common_summary_fields
      %w[created_at owned_by owned_by_agency_id photos
         flag_count status record_in_scope short_id alert_count]
    end

    def find_by_unique_identifier(unique_identifier)
      find_by('data @> ?', { unique_identifier: }.to_json)
    end

    def parent_form
      name.underscore.downcase
    end

    def preview_field_names
      PermittedFieldService::ID_SEARCH_FIELDS + Field.joins(:form_section).where(
        form_sections: { parent_form: },
        show_on_minify_form: true
      ).pluck(:name)
    end

    def nested_reportable_types
      []
    end
  end

  # Override this in the implementing classes to set your own defaults
  def defaults
    self.record_state = true if record_state.nil?
    self.status ||= STATUS_OPEN
  end

  def create_identification
    self.unique_identifier ||= SecureRandom.uuid
    self.short_id ||= self.unique_identifier.to_s.last(7)
    set_instance_id
  end

  def associations_as_data(_current_user)
    {}
  end

  def associations_as_data_keys
    []
  end

  def display_id
    short_id
  end

  def values_from_subform(subform_field_name, field_name)
    data[subform_field_name]&.map { |fds| fds[field_name] }&.compact&.uniq
  end

  # TODO: This is used in configurable exporters. Rename to something meaningful if useful
  # # @param attr_keys: An array whose elements are properties and array indeces
  #   # Ex: `child.value_for_attr_keys(['family_details_section', 0, 'relation_name'])`
  #   # is equivalent to doing `child.family_details_section[0].relation_name`
  def value_for_attr_keys(attr_keys)
    attr_keys.inject(data) do |acc, attr|
      acc.blank? ? nil : acc[attr]
    end
  end

  def update_properties(user, data)
    self.data = RecordMergeDataHashService.merge_data(self.data, data)
    self.record_user_update = true
    self.last_updated_by = user&.user_name
  end

  def nested_reportables_hash
    self.class.nested_reportable_types.each_with_object({}) do |type, hash|
      hash[type] = type.from_record(self) if try(type.record_field_name).present?
    end
  end

  def populate_subform_ids
    return unless data.present?

    data.each do |_, value|
      next unless value.is_a?(Array) && value.first.is_a?(Hash)

      value.each do |subform|
        subform['unique_id'].present? ||
          (subform['unique_id'] = SecureRandom.uuid)
      end
    end
  end

  def index_nested_reportables
    nested_reportables_hash.each do |_, reportables|
      Sunspot.index reportables if reportables.present?
    end
  end

  def unindex_nested_reportables
    nested_reportables_hash.each do |_, reportables|
      Sunspot.remove! reportables if reportables.present?
    end
  end

  def save_cfm_summary
    ch = self
    summary = ""

    latest_record = ch.data["cfm_section"].select { |record| record["date_1952b9f"].present? }.max_by { |record| record["date_1952b9f"] }
    
    if latest_record["cfm_age"] == "2_4"
      if latest_record["cfm_2_4_vision_wears_glasses"] == "true" 
        summary += "The child wears glasses \n"
        if latest_record["cfm_2_4_vision_difficulty_with_glasses"].present?
          summary += "Difficulty seeing with glasses: #{latest_record['cfm_2_4_vision_difficulty_with_glasses']}\n"
        end
      elsif latest_record["cfm_2_4_vision_wears_glasses"] == "false"
        summary += "The child doesn't wear glasses \n"
        if latest_record["cfm_2_4_vision_difficulty?"].present?
          summary += "Difficulty seeing without glasses: #{latest_record['cfm_2_4_vision_difficulty']}\n"
        end
      end

      if latest_record["cfm_2_4_hearing_uses_hearing_aid"] == "true" 
        summary += "The child wears hearing aid \n"
        if latest_record["cfm_2_4_hearing_difficulty_with_hearing_aid"].present?
          summary += "Difficulty hearing with hearing aid: #{latest_record['cfm_2_4_hearing_difficulty_with_hearing_aid']}\n"
        end
      elsif latest_record["cfm_2_4_hearing_uses_hearing_aid"] == "false"
        summary += "The child doesn't wear hearing aid \n"
        if latest_record["cfm_2_4_hearing_difficulty?"].present?
          summary += "Difficulty hearing without hearing aid: #{latest_record['cfm_2_4_hearing_difficulty']}\n"
        end
      end

      if latest_record["cfm_2_4_mobility_uses_equipment"] == "true" 
        summary += "The child uses equipment or receive assistance for walking \n"
        if latest_record["cfm_2_4_mobility_difficulty_without_equipment"].present?
          summary += "Difficulty walking without equipment/assistance: #{latest_record['cfm_2_4_mobility_difficulty_without_equipment']}\n"
        end
        if latest_record["cfm_2_4_mobility_difficulty_with_equipment"].present?
          summary += "Difficulty walking with equipment/assistance: #{latest_record['cfm_2_4_mobility_difficulty_with_equipment']}\n"
        end
      elsif latest_record["cfm_2_4_mobility_uses_equipment"] == "false"
        summary += "The child doesn't uses equipment or receive assistance for walking \n"
        if latest_record["cfm_2_4_mobility_difficulty_comparative?"].present?
          summary += "Difficulty for walking: #{latest_record['cfm_2_4_mobility_difficulty_comparative']}\n"
        end
      end

      if latest_record["cfm_2_4_dexterity_difficulty"].present?
        summary += "Difficulty picking up small objects with hand: #{latest_record['cfm_2_4_dexterity_difficulty']}\n"
      end

      if latest_record["cfm_2_4_communication_difficulty_understanding_you"].present?
        summary += "The child have difficulty to understand: #{latest_record['cfm_2_4_communication_difficulty_understanding_you']}\n"
      end

      if latest_record["cfm_2_4_communication_difficulty_understanding_child"].present?
        summary += "Difficulty to understand the child: #{latest_record['cfm_2_4_communication_difficulty_understanding_child']}\n"
      end

      if latest_record["cfm_2_4_learning_difficulty"].present?
        summary += "The child have difficulty for Learning: #{latest_record['cfm_2_4_learning_difficulty']}\n"
      end

      if latest_record["cfm_2_4_playing_difficulty"].present?
        summary += "The child have difficulty for playing: #{latest_record['cfm_2_4_playing_difficulty']}\n"
      end

      if latest_record["cfm_2_4_controlling_behavior_difficulty"].present?
        summary += "Difficulty for controlling behaviour like kick,bite or hit others: #{latest_record['cfm_2_4_controlling_behavior_difficulty']}\n"
      end
    else 
      if latest_record["cfm_5_17_vision_wears_glasses"] == "true" 
        summary += "The child wears glasses \n"
        if latest_record["cfm_5_17_vision_difficulty_with_glasses"].present?
          summary += "Difficulty seeing with glasses: #{latest_record['cfm_5_17_vision_difficulty_with_glasses']}\n"
        end
      elsif latest_record["cfm_5_17_vision_wears_glasses"] == "false"
        summary += "The child doesn't wear glasses \n"
        if latest_record["cfm_5_17_vision_difficulty?"].present?
          summary += "Difficulty seeing without glasses: #{latest_record['cfm_5_17_vision_difficulty']}\n"
        end
      end

      if latest_record["cfm_5_17_hearing_uses_hearing_aid"] == "true" 
        summary += "The child wears hearing aid \n"
        if latest_record["cfm_5_17_hearing_difficulty_with_hearing_aid"].present?
          summary += "Difficulty hearing with hearing aid: #{latest_record['cfm_5_17_hearing_difficulty_with_hearing_aid']}\n"
        end
      elsif latest_record["cfm_5_17_hearing_uses_hearing_aid"] == "false"
        summary += "The child doesn't wear hearing aid \n"
        if latest_record["cfm_5_17_hearing_difficulty?"].present?
          summary += "Difficulty hearing without hearing aid: #{latest_record['cfm_5_17_hearing_difficulty']}\n"
        end
      end

      if latest_record["cfm_5_17_mobility_uses_equipment"] == "true" 
        summary += "The child uses equipment or receive assistance for walking \n"
        
        if latest_record["cfm_5_17_mobility_difficulty_with_equipment_100m"].present?
          summary += "Difficulty walking 100 yards/meters with equipment/receive assistance: #{latest_record['cfm_5_17_mobility_difficulty_with_equipment_100m']}\n"
        end
        if latest_record["cfm_5_17_mobility_difficulty_with_equipment_500m"].present?
          summary += "Difficulty walking 500 yards/meters with equipment/receive assistance: #{latest_record['cfm_5_17_mobility_difficulty_with_equipment_500m']}\n"
        end
        if latest_record["cfm_5_17_mobility_difficulty_without_equipment_100m"].present?
          summary += "Difficulty walking 100 yards/meters without equipment/receive assistance: #{latest_record['cfm_5_17_mobility_difficulty_without_equipment_100m']}\n"
        end
        if latest_record["cfm_5_17_mobility_difficulty_without_equipment_500m"].present?
          summary += "Difficulty walking 500 yards/meters without equipment/receive assistance: #{latest_record['cfm_5_17_mobility_difficulty_without_equipment_500m']}\n"
        end
      elsif latest_record["cfm_5_17_mobility_uses_equipment"] == "false"
        summary += "The child doesn't uses equipment or receive assistance for walking \n"
        
        if latest_record["cfm_5_17_mobility_difficulty_comparative_100m"].present?
          summary += "Difficulty for walking 100 yards/meters: #{latest_record['cfm_5_17_mobility_difficulty_comparative_100m']}\n"
        end
        if latest_record["cfm_5_17_mobility_difficulty_comparative_500m"].present?
          summary += "Difficulty for walking 500 yards/meters: #{latest_record['cfm_5_17_mobility_difficulty_comparative_500m']}\n"
        end
      end

      if latest_record["cfm_5_17_self_care_difficulty"].present?
        summary += "Difficulty with self-care such as feeding or dressing him/herself: #{latest_record['cfm_5_17_self_care_difficulty']}\n"
      end

      if latest_record["cfm_5_17_communication_difficulty_understanding_child_household"].present?
        summary += "The child have difficulty to understand by people inside of this household: #{latest_record['cfm_5_17_communication_difficulty_understanding_child_household']}\n"
      end

      if latest_record["cfm_5_17_communication_difficulty_understanding_child_others"].present?
        summary += "The child have difficulty to understand by people outside of this household: #{latest_record['cfm_5_17_communication_difficulty_understanding_child_others']}\n"
      end

      if latest_record["cfm_5_17_learning_difficulty"].present?
        summary += "The child have difficulty for Learning: #{latest_record['cfm_5_17_learning_difficulty']}\n"
      end

      if latest_record["cfm_5_17_remembering_difficulty"].present?
        summary += "The child have difficulty in remembering things: #{latest_record['cfm_5_17_remembering_difficulty']}\n"
      end

      if latest_record["cfm_5_17_concentrating_difficulty"].present?
        summary += "The child have difficulty in concentrating on an activity: #{latest_record['cfm_5_17_concentrating_difficulty']}\n"
      end

      if latest_record["cfm_5_17_accepting_change_difficulty"].present?
        summary += "The child have difficulty in accepting changes in his/her routine: #{latest_record['cfm_5_17_accepting_change_difficulty']}\n"
      end

      if latest_record["cfm_5_17_controlling_behavior_difficulty"].present?
        summary += "Difficulty for controlling behaviour: #{latest_record['cfm_5_17_controlling_behavior_difficulty']}\n"
      end

      if latest_record["cfm_5_17_making_friends_difficulty"].present?
        summary += "The child have difficulty for making freinds: #{latest_record['cfm_5_17_making_friends_difficulty']}\n"
      end

      if latest_record["cfm_5_17_anxiety_how_often"].present?
        summary += "The child seem very anxious, nervous or worried: #{latest_record['cfm_5_17_anxiety_how_often']}\n"
      end

      if latest_record["cfm_5_17_depression_how_often"].present?
        summary += "The child seem very sad or depressed: #{latest_record['cfm_5_17_depression_how_often']}\n"
      end

    end
    self.data["summary_35059cf"] = summary
  end
end
