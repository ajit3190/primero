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

  def export(start_date, end_date)
    export_user_row(start_date, end_date)
    modules = UserService.modules
    modules.each { |modul| export_modules(modul, start_date, end_date) }
  end

  def complete
    @workbook.close
    buffer
  end

  private

  def export_modules(modul, start_date, end_date)
    return if modul.blank? or modul.instance_of?(ActiveRecord::Relation)

    export_module_to_workbook(modul, start_date, end_date)
  end

  def export_module_to_workbook(modul, start_date, end_date)
    worksheet = workbook.add_worksheet(modul.name)
    set_column_width(worksheet)
    worksheet.write(0, 0, module_header)
    worksheet.write(1, 0, module_content(modul.unique_id,start_date,end_date))
  end

  def module_header
    keys = ["Total Cases", "Open Cases", "Closed Cases",  "Open this quarter", "Closed this Quarter","Total Services", "Total followups", "Total incidents", "Incidents this quarter"]
  end

  def module_content(module_id,start_date,end_date)
    keys = [UserService.total_records(module_id,Child, start_date, end_date).count,
            UserService.open_cases(module_id, start_date, end_date).count,
            UserService.closed_cases(module_id, start_date, end_date).count,
            UserService.new_records_quarter(module_id,Child).count,
            UserService.closed_cases_quarter(module_id).count,
            UserService.total_services(module_id, start_date, end_date).count,
            UserService.total_followup(module_id, start_date, end_date).count,
            UserService.total_records(module_id,Incident, start_date, end_date).count,
            UserService.new_records_quarter(module_id,Incident).count]
  end

  def export_user_row(start_date,end_date)
    worksheet = workbook.add_worksheet('Users')
    set_column_width(worksheet)
    worksheet.write(0, 0, user_header)
    worksheet.write(1, 0, user_content(start_date,end_date))
  end

  def user_header
    keys = ['Total Users', 'Active Users', 'Disabled Users', 'New Users in this quarter', 'Total Number of Agency', 'Agency List']
  end

  def user_content(start_date,end_date)
    keys = [UserService.all_users(start_date,end_date).count,UserService.active_users(start_date,end_date).count,UserService.disabled_users(start_date,end_date).count,UserService.new_users.count,UserService.all_agencies(start_date,end_date).count, UserService.all_agencies(start_date,end_date).pluck(:unique_id)]
  end

  def set_column_width(worksheet)
    ('A'..'L').each_with_index do |col_letter, col_index|
      worksheet.set_column(col_index, col_index, 20) # Adjust column width
    end
  end

end
# rubocop:enable Metrics/ClassLength
