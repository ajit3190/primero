class UserService

	def self.all_users
		User.all
	end

	def self.active_users
		User.where(disabled: false)
	end

	def self.disabled_users
		User.where(disabled: true)
	end

	def self.new_users
		User.where('created_at >= ?', 25.days.ago)
	end

	def self.all_agencies
		Agency.all
	end

	def self.modules
		PrimeroModule.all
	end

	def self.total_records(module_id,recordtype)
		recordtype.where("data->>'module_id' = ?", module_id)
	end

	def self.open_cases(module_id)
		Child.where("data->>'module_id' = ? AND data->>'status' = ?", module_id, "open")
	end

	def self.closed_cases(module_id)
		Child.where("data->>'module_id' = ? AND data->>'status' = ?", module_id, "closed")
	end

	def self.new_records_quarter(module_id,recordtype)
		recordtype.where("data->>'module_id' = ? AND CAST(data->>'created_at' AS TIMESTAMP) >= ?", module_id, 25.days.ago)
	end

	def self.closed_cases_quarter(module_id)
		Child.where("data->>'module_id' = ? AND CAST(data->>'date_closure' AS TIMESTAMP) >= ?", module_id, 25.days.ago)
	end

	def self.total_services(module_id)
		cases = Child.where("data->>'module_id' = ?", module_id)
		cases.flat_map { |c| c.data['services_section'] }.compact
	end

	def self.total_followup(module_id)
		cases = Child.where("data->>'module_id' = ?", module_id)
		cases.flat_map { |c| c.data['followup_subform_section'] }.compact
	end

end