# frozen_string_literal: true

# Export forms to an Excel file (.xlsx)
# rubocop:disable Metrics/ClassLength
class Exporters::UsageReportExporter < Exporters::BaseExporter
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

  def export(start_date, end_date, request)
    export_user_row(start_date, end_date, request)
    modules = UsageReport.modules
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
    worksheet.write(0, 0, module_header(modul.name))
    worksheet.write(1, 0, module_content(modul.unique_id,start_date,end_date,modul.name))
  end


  def module_header(modul_name)
    common_keys = [modul_name, "Total Cases", "Open Cases", "Closed Cases", "Open this quarter", "Closed this Quarter", "Total Services", "Total incidents", "Incidents this quarter"]

    keys = case modul_name
           when "MRM"
             [modul_name, "Total incidents", "Incidents this quarter"]
           when "GBV"
             common_keys
           else
             common_keys + ["Total followups"]
           end
  end


  def module_content(module_id,start_date,end_date,modul_name)
    common_keys = ["",
                   UsageReport.total_records(module_id,Child, start_date, end_date).count,
                   UsageReport.open_cases(module_id, start_date, end_date).count,
                   UsageReport.closed_cases(module_id, start_date, end_date).count,
                   UsageReport.new_records_quarter(module_id, end_date,Child).count,
                   UsageReport.closed_cases_quarter(module_id, end_date).count,
                   UsageReport.total_services(module_id, start_date, end_date).count,      
                   UsageReport.total_records(module_id,Incident, start_date, end_date).count,
                   UsageReport.new_records_quarter(module_id, end_date,Incident).count]

    keys =  case modul_name
            when "MRM"
              ["", UsageReport.total_records(module_id,Incident, start_date, end_date).count,UsageReport.new_records_quarter(module_id, end_date,Incident).count] 
            when "GBV"
              common_keys 
            else
              common_keys + [UsageReport.total_followup(module_id, start_date, end_date).count]
            end
  end

  def export_user_row(start_date, end_date, request)
    worksheet = workbook.add_worksheet('Users')
    set_column_width(worksheet)
    worksheet.write(0, 0, user_url_header(request))
    worksheet.write(1, 0, user_start_date_header(start_date))
    worksheet.write(2, 0, user_end_date_header(end_date))
    worksheet.write(3, 0, total_agencies)
    modules = UsageReport.modules
    row_indx = 5
    modules.each do |modul|
      worksheet.write(row_indx, 0, module_tabs(modul.unique_id,start_date, end_date,modul.name))
      row_indx += 1 
    end
    worksheet.write(9, 0, user_header)
    worksheet.write(10, 0, user_content(start_date, end_date))
  end

  def user_url_header(request)
    ['Url', request]
  end

  def user_start_date_header(start_date)
    ['Start Date', start_date]
  end

  def user_end_date_header(end_date)
    ['End Date', end_date]
  end

  def total_agencies
    ['Total No. of Agencies', UsageReport.all_agencies.count]
  end

  def module_tabs(module_id, start_date, end_date, modul_name)
    [modul_name, UsageReport.total_records(module_id,Child, start_date, end_date).count > 0 ? " Yes" : " No"]
  end

  def user_header
    ['Agency List', 'Total Users', 'Active Users', 'Disabled Users', 'New Users in this quarter']
  end

  def user_content(start_date, end_date)
    data = UsageReport.all_agencies.map do |agency|
      [agency.unique_id,
       UsageReport.all_users(start_date, end_date, agency).count,
       UsageReport.active_users(start_date, end_date, agency).count,
       UsageReport.disabled_users(start_date, end_date, agency).count,
       UsageReport.new_quarter_users(agency, end_date).count]
    end

    data.transpose
  end


  def set_column_width(worksheet)
    ('A'..'L').each_with_index do |col_letter, col_index|
      worksheet.set_column(col_index, col_index, 20) # Adjust column width
    end
  end

end
# rubocop:enable Metrics/ClassLength
