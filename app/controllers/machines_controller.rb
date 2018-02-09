class MachinesController < ApplicationController
  before_filter :set_new_layout

  def index
    authorize!(:view, :machines_page)

    unless index_params_present?
      return redirect_to(machines_path(index_redirect_params))
    end
    per_page = 5

    machines = MachineIndexQuery.new(
      venue: venue_from_params,
      filter: filter_from_params
    ).all
    .includes(:created_by_user)
    .order("created_at DESC")

    paginated_machines = machines.paginate(
      page: page_from_params,
      per_page: per_page
    )
    machine_creator_users = User.joins(:machines).includes(:name)  << current_user
    machine_creator_users = machine_creator_users.uniq{|user| user.id}
    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!

    render locals: {
      access_token: access_token.token,
      machines: paginated_machines,
      machines_size: machines.size,
      page: page_from_params,
      per_page: per_page,
      venue: venue_from_params,
      machine_creator_users: machine_creator_users,
      accessible_venues: accessible_venues,
      filter: filter_from_params
    }
  end

  private
  def index_redirect_params
    venue = venue_from_params || current_user.default_venue
    filter = filter_from_params || "enabled"
    page = page_from_params || "1"
    {
      venue_id: venue.id,
      filter: filter,
      page: page
    }
  end

  def index_params_present?
    venue_from_params.present? &&
    filter_from_params.present? &&
    page_from_params
  end

  def accessible_venues
    AccessibleVenuesQuery.new(current_user).all
  end

  def venue_from_params
    accessible_venues.find_by(id: params[:venue_id])
  end

  def page_from_params
    params[:page]
  end

  def filter_from_params
    if ["enabled", "all"].include? params[:filter]
      params[:filter]
    end
  end
end  
