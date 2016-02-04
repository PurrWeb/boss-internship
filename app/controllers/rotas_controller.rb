class RotasController < ApplicationController
  before_action :authorize

  def index
    if start_date_from_params.present? && end_date_from_params.present? && venue_from_params.present?
      start_date = start_date_from_params
      end_date = end_date_from_params
      venue = venue_from_params

      UIRotaDate.assert_date_range_valid(start_date, end_date)

      rotas = (start_date..end_date).map do |date|
        Rota.find_or_initialize_by(
          date: date,
          venue: venue
        )
      end

      render locals: {
        accessible_venues: accessible_venues_for(current_user),
        venue: venue,
        start_date: start_date,
        end_date: end_date,
        rotas: rotas,
        staff_types: StaffType.all
      }
    else
      redirect_to(rotas_path(redirect_params))
    end
  end

  def show
    raise ActiveRecord::RecordNotFound unless venue_from_params.present?

    rota = Rota.find_or_initialize_by(
      date: rota_date_from_params,
      venue: venue_from_params
    )
    authorize!(:manage, rota)

    render locals: { rota: rota, staff_types: StaffType.all }
  end

  private
  def authorize
    authorize! :manage, :rotas
  end

  def accessible_venues_for(user)
    AccessibleVenuesQuery.new(user).all
  end

  def redirect_params
    {
      start_date: start_date_from_params || default_start_date,
      end_date: end_date_from_params || default_end_date,
      venue_id: venue_from_params || default_venue.id
    }
  end

  def start_date_from_params
    if params[:start_date].present?
      UIRotaDate.params(params[:start_date])
    end
  end

  def assert_date_range_valid(start_date, end_date)
    day_delta = ((start_date - end_date) / 1.day).abs
    if (day_delta > 7)
      raise "invalid date range supplied #{start_date} - #{end_date}"
    end
  end

  def default_start_date
    UIRotaDate.format(Time.now.beginning_of_week)
  end

  def end_date_from_params
    if params[:end_date].present?
      UIRotaDate.params(params[:end_date])
    end
  end

  def default_end_date
    UIRotaDate.format(Time.now.end_of_week)
  end

  def default_venue
    if current_user.manager?
      current_user.venues.first
    else
      Venue.first
    end
  end

  def rota_date_from_params
    UIRotaDate.parse(params.fetch(:id))
  end

  def venue_from_params
    Venue.find_by(id: params[:venue_id])
  end
end
