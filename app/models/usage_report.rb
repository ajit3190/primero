# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Retrieves a list of record histories by type

class UsageReport
	include ActiveModel::Model

	class << self

		def user_agencies(agency_id)
			User.joins(:agency).where(agencies: { unique_id: agency_id })
		end

		def all_users(start_date,end_date,agency)
			user_agencies(agency.unique_id).where(created_at: start_date.beginning_of_day..end_date.end_of_day)
		end

		def active_users(start_date,end_date,agency)
			user_agencies(agency.unique_id).where(disabled: false,created_at: start_date.beginning_of_day..end_date.end_of_day)
		end

		def disabled_users(start_date,end_date,agency)
			user_agencies(agency.unique_id).where(disabled: true,created_at: start_date.beginning_of_day..end_date.end_of_day)
		end

		def quarter_dates(offset)
			date = Date.today
			[date.beginning_of_quarter, date.end_of_quarter]
		end

		def new_quarter_users(agency)
			user_agencies(agency.unique_id).where("DATE(users.created_at) BETWEEN ? AND ?", quarter_dates(1).first, quarter_dates(1).last)
		end

		def all_agencies
			Agency.all
		end

		def modules
			PrimeroModule.all
		end

		def total_records(module_id,recordtype,start_date,end_date)
			recordtype.where("data->>'module_id' = ? AND CAST(data->>'created_at' AS DATE) BETWEEN ? AND ?", module_id,start_date,end_date)
		end

		def open_cases(module_id,start_date,end_date)
			Child.where("data->>'module_id' = ? AND data->>'status' = ? AND CAST(data->>'created_at' AS DATE) BETWEEN ? AND ?", module_id, "open",start_date,end_date)
		end

		def closed_cases(module_id,start_date,end_date)
			Child.where("data->>'module_id' = ? AND data->>'status' = ? AND CAST(data->>'created_at' AS DATE) BETWEEN ? AND ?", module_id, "closed",start_date,end_date)
		end

		def new_records_quarter(module_id,recordtype)
			recordtype.where("data->>'module_id' = ? AND CAST(data->>'created_at' AS DATE) BETWEEN ? AND ?", module_id, quarter_dates(1).first, quarter_dates(1).last)
		end

		def closed_cases_quarter(module_id)
			Child.where("data->>'module_id' = ? AND CAST(data->>'date_closure' AS DATE) BETWEEN ? AND ?", module_id, quarter_dates(1).first, quarter_dates(1).last)
		end

		def total_services(module_id,start_date,end_date)
			cases = Child.where("data->>'module_id' = ? AND CAST(data->>'created_at' AS DATE) BETWEEN ? AND ?", module_id,start_date,end_date)
			cases.flat_map { |c| c.data['services_section'] }.compact
		end

		def total_followup(module_id,start_date,end_date)
			cases = Child.where("data->>'module_id' = ? AND CAST(data->>'created_at' AS DATE) BETWEEN ? AND ?", module_id,start_date,end_date)
			cases.flat_map { |c| c.data['followup_subform_section'] }.compact
		end
	end
end