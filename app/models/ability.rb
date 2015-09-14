class Ability
  include CanCan::Ability

  def initialize(user)
    alias_action :index, :view, :list, :export, :to => :read
    alias_action :edit, :update, :create, :new, :destroy, :disable, :to => :write

    @user = user

    can [:read, :write], User do |uzer|
      uzer.user_name == user.user_name
    end

    user.permissions.each do |permission|
      case permission.resource
        when Permission::USER
          user_permissions
        when Permission::METADATA
          metadata_permissions
        when Permission::SYSTEM
          system_permissions
        else
          configure_resource permission.resource, permission.actions, permission.is_record?
      end

      #TODO - what to do with this???
      #if user.has_permission? Permission::SYNC_MOBILE
        #can :index, FormSection
      #end
    end
  end

  def user_permissions
    #TODO - Handle Permission::ALL and Permission::GROUP
    can actions, User do |uzer|
      if user.has_permission? Permission::ALL
        true
      elsif user.has_permission? Permission::GROUP
        (user.user_group_ids & uzer.user_group_ids).size > 0
      else
        uzer.user_name == user.user_name
      end
    end
    [Role, UserGroup, Agency].each do |resource|
      configure_resource resource, permission.actions
    end
  end

  def metadata_permissions
    [FormSection, Field, Location, Lookup, PrimeroProgram, PrimeroModule].each do |resource|
      #configure_resource resource, permission.actions
      can :manage, resource
    end
  end

  def system_permissions
    [ContactInformation, Device, Replication, SystemUsers].each do |resource|
      #configure_resource resource, actions
      can :manage, resource
    end
  end

  def user
    @user
  end

  def configure_resource(resource, actions, is_record=false)
    #binding.pry
    if is_record
      can actions, resource do |instance|
        #TODO - Handle Permission::ALL and Permission::GROUP
        if user.has_permission? Permission::ALL
          true
        elsif user.has_permission? Permission::GROUP
          allowed_groups = instance.associated_users.map{|u|u.user_group_ids}.flatten.compact
          (user.user_group_ids & allowed_groups).size > 0
        else
          instance.associated_user_names.include? user.user_name
        end
      end
    else
      can actions, resource
    end
  end

  def can(action = nil, subject = nil, conditions = nil, &block)
    rules << CanCan::CustomRule.new(true, action, subject, conditions, block)
  end

  def cannot(action = nil, subject = nil, conditions = nil, &block)
    rules << CanCan::CustomRule.new(false, action, subject, conditions, block)
  end
end
