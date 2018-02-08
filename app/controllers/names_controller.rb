class NamesController < ApplicationController
  before_action :authorize

  def index
    filter = NamesIndexFilter.new(params[:filter])
    groups = filter
      .query
      .all
      .group_by(&:first_name_group_id)

    render locals: {filter: filter, groups: groups}
  end

  private
  def authorize
    authorize! :view, :names_page
  end
end
