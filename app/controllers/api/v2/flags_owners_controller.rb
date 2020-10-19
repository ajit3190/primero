# frozen_string_literal: true

# API to fetch the list of flags given a user
class Api::V2::FlagsOwnersController < ApplicationApiController
  include Api::V2::Concerns::Pagination

  before_action :load_flags, only: %i[index]

  def index
    authorize! :index, Flag
  end

  protected

  def load_flags
    @flags = Flag.by_owner(query_scope, record_types)
  end

  private

  def query_scope
    current_user.record_query_scope(model_class, params[:id_search])
  end

  def record_types
    @record_types = params[:record_type]&.split(',')
  end
end
