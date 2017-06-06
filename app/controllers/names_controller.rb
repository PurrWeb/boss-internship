class NamesController < ApplicationController
  before_action :authorize

  def index
    filter = NamesIndexFilter.new(params[:filter])
    groups = filter
      .query
      .all
      .includes(:first_name_group)
      .group_by(&:first_name_group)

    render locals: {filter: filter, groups: groups}
  end

  private
  def authorize
    authorize! :manage, :admin
  end
end
