# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.array! @form_sections do |form|
    json.partial! 'api/v2/form_sections/form_section', form:
  end
end
