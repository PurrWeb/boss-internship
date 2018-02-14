class MachineRefloatsController < ApplicationController
  before_action :set_new_layout, only: [:index]

  def index
    authorize!(:view, :machine_refloats_page)

    if !index_params_present?
      return redirect_to(machine_refloats_path(index_redirect_params))
    end
    per_page = 5

    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
    machines_refloats = MachinesRefloatsIndexQuery.new(
      venue: venue_from_params,
      params: params
    ).all

    paginated_machines_refloats = machines_refloats.paginate(
      page: page_from_params,
      per_page: per_page
    )

    machines_refloats_users = User.joins([:machines_refloats, :venues]).where(venues: {id: venue_from_params.id}).uniq

    render locals: {
      access_token: access_token.token,
      current_venue: venue_from_params,
      machines_refloats: paginated_machines_refloats,
      machines_refloats_users: machines_refloats_users,
      venue_machines: venue_from_params.machines.enabled,
      start_date: start_date_from_params,
      end_date: end_date_from_params,
      machine_id: machine_from_params,
      user_id: user_from_params,
      page: page_from_params,
      per_page: per_page,
      size: machines_refloats.size,
    }
  end


  private
  def index_params_present?
    venue_from_params.present? &&
      start_date_from_params.present? &&
      end_date_from_params.present? &&
      page_from_params
  end

  def start_date_from_params
    result = nil
    begin
      result = UIRotaDate.parse(params[:start_date])
    rescue; end
    result
  end

  def end_date_from_params
    result = nil
    begin
      result = UIRotaDate.parse(params[:end_date])
    rescue; end
    result
  end

  def machine_from_params
    result = nil
    begin
      result = Integer(params[:machine_id])
    rescue; end
    result
  end

  def user_from_params
    result = nil
    begin
      result = Integer(params[:user_id])
    rescue; end
    result
  end

  def index_redirect_params
    venue = venue_from_params || current_user.default_venue
    start_date = start_date_from_params || current_tax_year.start_date
    end_date = end_date_from_params || RotaShiftDate.to_rota_date(Time.current)
    page = page_from_params || "1"
    {
      venue_id: venue.id,
      start_date: UIRotaDate.format(start_date),
      end_date: UIRotaDate.format(end_date),
      page: page
    }
  end

  def page_from_params
    params[:page]
  end

  def accessible_venues
    AccessibleVenuesQuery.new(current_user).all
  end

  def venue_from_params
    accessible_venues.find_by(id: params[:venue_id])
  end

  def current_tax_year
    @current_tax_year ||= TaxYear.new(RotaShiftDate.to_rota_date(Time.current))
  end
end
