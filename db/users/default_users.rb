def create_or_update_user(user_hash)
  user_id = User.user_id_from_name user_hash["user_name"]
  user = User.get user_id

  if user.nil?
    puts "Creating user #{user_id}"
    User.create! user_hash
  else
    puts "Updating user #{user_id}"
    user_attributes = {
       "user_name" => user_hash["user_name"],
       "full_name" => user_hash["full_name"],
       "role_ids" => user_hash["role_ids"]
    }
    user.update_attributes user_attributes
  end

end


create_or_update_user(
  "user_name" => "primero",
  "password" => "qu01n23",
  "password_confirmation" => "qu01n23",
  "full_name" => "System Superuser",
  "email" => "primero@primero.com",
  "disabled" => "false",
  "organisation" => "N/A",
  "role_ids" => Role.by_name.all.map{|r| r.id},
  "module_ids" => PrimeroModule.by_name.all.map{|m| m.id}
)

create_or_update_user(
  "user_name" => "primero_cp",
  "password" => "qu01n23",
  "password_confirmation" => "qu01n23",
  "full_name" => "CP Worker",
  "email" => "primero_cp@primero.com",
  "disabled" => "false",
  "organisation" => "N/A",
  "role_ids" => [
    Role.by_name(:key => "Worker: Cases").first.id,
    Role.by_name(:key => "Worker: Tracing Requests").first.id
  ],
  "module_ids" => [PrimeroModule.by_name(key: "CP").first.id]
)

create_or_update_user(
  "user_name" => "primero_gbv",
  "password" => "qu01n23",
  "password_confirmation" => "qu01n23",
  "full_name" => "GBV Worker",
  "email" => "primero_gbv@primero.com",
  "disabled" => "false",
  "organisation" => "N/A",
  "role_ids" => [
    Role.by_name(:key => "Worker: Incidents").first.id,
    Role.by_name(:key => "Worker: Cases").first.id
  ],
  "module_ids" => [PrimeroModule.by_name(key: "GBV").first.id]
)

create_or_update_user(
  "user_name" => "primero_mrm",
  "password" => "qu01n23",
  "password_confirmation" => "qu01n23",
  "full_name" => "MRM Worker",
  "email" => "primero_mrm@primero.com",
  "disabled" => "false",
  "organisation" => "N/A",
  "role_ids" => [Role.by_name(:key => "Worker: Incidents").first.id],
  "module_ids" => ["MRM"]
)
