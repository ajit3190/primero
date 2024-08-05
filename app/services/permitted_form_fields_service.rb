# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# This service handles computing the permitted fields for a given role,
# based on the forms associated with that role. The query is optionally cached.
# The similarly named PermittedFieldService uses this service to compuyte the full list of permitted fields
class PermittedFormFieldsService
  attr_accessor :fields, :field_names, :with_cache

  PERMITTED_WRITEABLE_FIELD_TYPES = [
    Field::TEXT_FIELD, Field::TEXT_AREA, Field::RADIO_BUTTON, Field::TICK_BOX,
    Field::SELECT_BOX, Field::NUMERIC_FIELD, Field::DATE_FIELD,
    Field::AUDIO_UPLOAD_BOX, Field::PHOTO_UPLOAD_BOX, Field::DOCUMENT_UPLOAD_BOX,
    Field::SUBFORM
  ].freeze

  # TODO: Primero is assuming that these forms exist in the configuration. If they
  PERMITTED_SUBFORMS_FOR_ACTION = {
    Permission::ADD_NOTE => 'notes_section',
    Permission::INCIDENT_DETAILS_FROM_CASE => 'incident_details',
    Permission::SERVICES_SECTION_FROM_CASE => 'services_section'
  }.freeze

  def self.instance
    new(Rails.configuration.use_app_cache)
  end

  def initialize(with_cache = false)
    self.with_cache = with_cache
  end

  def rebuild_cache(roles, record_type, writeable, force = false)
    return unless force || fields.nil?

    # The assumption here is that the cache will be updated if any changes took place to Forms, or Roles
    role_keys = roles.map(&:cache_key_with_version)
    cache_key = "permitted_form_fields_service/#{role_keys.join('/')}/#{record_type}/#{writeable}"
    self.fields = Rails.cache.fetch(cache_key, expires_in: 48.hours) do
      permitted_fields_from_forms(roles, record_type, writeable).to_a
    end
    # TODO: This can be cached too
    self.field_names = fields.map(&:name).uniq
  end

  def permitted_fields_from_forms(roles, record_type, writeable, visible_only = false)
    fields = fetch_filtered_fields(roles, record_type, visible_only)
    return fields unless writeable

    filter_writeable_fields(fields, permission_level(writeable))
    action_subform_fields = permitted_subforms_from_actions(roles, record_type)
    append_action_subform_fields(fields, action_subform_fields)
  end

  alias with_cache? with_cache

  def permitted_fields(roles, record_type, writeable)
    if with_cache?
      rebuild_cache(roles, record_type, writeable)
      fields
    else
      permitted_fields_from_forms(roles, record_type, writeable).to_a
    end
  end

  def permitted_field_names(roles, record_type, writeable)
    if with_cache?
      rebuild_cache(roles, record_type, writeable)
      field_names
    else
      permitted_fields_from_forms(roles, record_type, writeable).map(&:name).uniq
    end
  end

  def permitted_subforms_from_actions(roles, record_type)
    roles = [roles].flatten
    roles.map do |role|
      PERMITTED_SUBFORMS_FOR_ACTION.select { |k, _v| role.permits?(record_type, k) }.values
    end.flatten.uniq
  end

  private

  def permission_level(writeable)
    writeable ? FormPermission::PERMISSIONS[:read_write] : writeable
  end

  def eagerloaded_fields
    Field.includes(subform: :fields).left_outer_joins(form_section: :roles)
  end

  def fetch_filtered_fields(roles, record_type, visible_only)
    eagerloaded_fields.where(
      fields: {
        form_sections: {
          roles: { id: roles },
          parent_form: record_type,
          visible: visible_only || nil
        }.compact
      }
    )
  end

  def filter_writeable_fields(fields, permission_level)
    fields.where(
      fields: {
        form_sections: { form_sections_roles: { permission: permission_level } },
        type: PERMITTED_WRITEABLE_FIELD_TYPES
      }
    )
  end

  def append_action_subform_fields(fields, action_subform_fields)
    return fields unless action_subform_fields.present?

    fields.or(
      eagerloaded_fields.where(
        name: action_subform_fields,
        type: Field::SUBFORM
      )
    )
  end
end
