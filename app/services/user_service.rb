class UserService

	def self.all_users(start_date,end_date)
		User.where(created_at: start_date.beginning_of_day..end_date.end_of_day)
	end

	def self.active_users(start_date,end_date)
		User.where(disabled: false,created_at: start_date.beginning_of_day..end_date.end_of_day)
	end

	def self.disabled_users(start_date,end_date)
		User.where(disabled: true,created_at: start_date.beginning_of_day..end_date.end_of_day)
	end

	def self.quarter_dates(offset)
		date = Date.today << (offset * 3)
		[date.beginning_of_quarter, date.end_of_quarter]
	end

	def self.new_users
		User.where("DATE(created_at) BETWEEN ? AND ?", quarter_dates(1).first, quarter_dates(1).last)
	end

	def self.all_agencies(start_date,end_date)
		Agency.where(created_at: start_date.beginning_of_day..end_date.end_of_day)
	end

	def self.modules
		PrimeroModule.all
	end

	def self.total_records(module_id,recordtype,start_date,end_date)
		recordtype.where("data->>'module_id' = ? AND CAST(data->>'created_at' AS DATE) BETWEEN ? AND ?", module_id,start_date,end_date)
	end

	def self.open_cases(module_id,start_date,end_date)
		Child.where("data->>'module_id' = ? AND data->>'status' = ? AND CAST(data->>'created_at' AS DATE) BETWEEN ? AND ?", module_id, "open",start_date,end_date)
	end

	def self.closed_cases(module_id,start_date,end_date)
		Child.where("data->>'module_id' = ? AND data->>'status' = ? AND CAST(data->>'created_at' AS DATE) BETWEEN ? AND ?", module_id, "closed",start_date,end_date)
	end

	def self.new_records_quarter(module_id,recordtype)
		recordtype.where("data->>'module_id' = ? AND CAST(data->>'created_at' AS DATE) BETWEEN ? AND ?", module_id, quarter_dates(1).first, quarter_dates(1).last)
	end

	def self.closed_cases_quarter(module_id)
		Child.where("data->>'module_id' = ? AND CAST(data->>'date_closure' AS DATE) BETWEEN ? AND ?", module_id, quarter_dates(1).first, quarter_dates(1).last)
	end

	def self.total_services(module_id,start_date,end_date)
		cases = Child.where("data->>'module_id' = ? AND CAST(data->>'created_at' AS DATE) BETWEEN ? AND ?", module_id,start_date,end_date)
		cases.flat_map { |c| c.data['services_section'] }.compact
	end

	def self.total_followup(module_id,start_date,end_date)
		cases = Child.where("data->>'module_id' = ? AND CAST(data->>'created_at' AS DATE) BETWEEN ? AND ?", module_id,start_date,end_date)
		cases.flat_map { |c| c.data['followup_subform_section'] }.compact
	end

end