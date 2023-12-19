# frozen_string_literal: true

# Export forms to an Excel file (.xlsx)
# rubocop:disable Metrics/ClassLength
class Exporters::UserExporter < Exporters::BaseExporter
  attr_accessor :file_name, :workbook, :errors, :worksheets

  class << self
    def id
      'xlsx'
    end

    def supported_models
      [User]
    end
  end

  def initialize(output_file_path = nil, config = {}, options = {})
    super(output_file_path, config, options)
    self.workbook = WriteXLSX.new(buffer)
    self.worksheets = {}
    self.locale = user&.locale || I18n.locale
  end

  def export
    export_user_row
    modules = UserService.modules
    modules.each { |modul| export_modules(modul) }
  end

  def complete
    @workbook.close
    buffer
  end

  private

  def export_modules(modul)
    return if modul.blank? or modul.instance_of?(ActiveRecord::Relation)

    export_module_to_workbook(modul)
  end

  def export_module_to_workbook(modul)
    worksheet = workbook.add_worksheet(modul.name)
    set_column_width(worksheet)
    worksheet.write(0, 0, module_header)
    worksheet.write(1, 0, module_content(modul.unique_id))
  end

  def module_header
    keys = ["Total Cases", "Open Cases", "Closed Cases",  "Open this quarter", "Closed this Quarter","Total Services", "Total followups", "Total incidents", "Incidents this quarter"]
  end

  def module_content(module_id)
    keys = [UserService.total_records(module_id,Child).count,
            UserService.open_cases(module_id).count,
            UserService.closed_cases(module_id).count,
            UserService.new_records_quarter(module_id,Child).count,
            UserService.closed_cases_quarter(module_id).count,
            UserService.total_services(module_id).count,
            UserService.total_followup(module_id).count,
            UserService.total_records(module_id,Incident).count,
            UserService.new_records_quarter(module_id,Incident).count]
  end

  def export_user_row
    worksheet = workbook.add_worksheet('Users')
    set_column_width(worksheet)
    worksheet.write(0, 0, user_header)
    worksheet.write(1, 0, user_content)
  end

  def user_header
    keys = ['Total Users', 'Active Users', 'Disable Users', 'New Users in this quarter', 'Total Number of Agency']
  end

  def user_content
    keys = [UserService.all_users.count,UserService.active_users.count,UserService.disabled_users.count,UserService.new_users.count,UserService.all_agencies.count]
  end

  def set_column_width(worksheet)
    ('A'..'L').each_with_index do |col_letter, col_index|
      worksheet.set_column(col_index, col_index, 20) # Adjust column width
    end
  end

end
# rubocop:enable Metrics/ClassLength
