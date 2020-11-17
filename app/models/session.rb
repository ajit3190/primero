class Session < CouchRest::Model::Base
  use_database :sessions

  include PrimeroModel

  property :imei
  property :user_name
  property :timestamp, DateTime

  design

  design :by_user_name do
    view :by_user_name
  end

  before_create :create_timestamp

  def create_timestamp
    self.timestamp ||= DateTime.now
  end

  def self.for_user( user, imei)
    Session.new(
      :user_name => user.user_name,
      :imei => imei
    )
  end

  def user
    @user ||= User.find_by_user_name(user_name)
  end

  def self.delete_for(user)
    by_user_name(:key => user.user_name).each {|s| s.destroy }
  end

  def token
    self.id
  end

  def full_name
    user.full_name
  end

  def device_blacklisted?
    if (imei)
      return true if Device.all.any? {|device| device.imei == imei && device.blacklisted? }
    end
    false
  end

  def expired?
    timestamp.blank? ||
      ((DateTime.now.to_time - self.timestamp.to_time) / 1.seconds) > Rails.application.config.primero_session_duration
  end

  def unexpired!
    if expired?
      destroy
      nil
    else
      self
    end
  end
end
