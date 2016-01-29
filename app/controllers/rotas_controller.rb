class RotasController < ApplicationController
  before_action :authorize

  def index
    if start_date_from_params.present? && end_date_from_params.present? && venue_from_params.present?
      start_date = start_date_from_params
      end_date = end_date_from_params
      venue = venue_from_params

      assert_date_range_valid(start_date, end_date)

      rotas = (start_date..end_date).map do |date|
        Rota.find_or_initialize_by(
          date: date,
          venue: venue
        )
      end

      render locals: {
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

  def redirect_params
    {
      start_date: start_date_from_params || default_start_date,
      end_date: end_date_from_params || default_end_date,
      venue_id: venue_from_params || default_venue.id
    }
  end


  def start_date_from_params
    if params[:start_date].present?
      Date.strptime(params[:start_date], Rota.url_date_format)
    end
  end

  def default_start_date
    1.week.ago.strftime(Rota.url_date_format)
  end

  def end_date_from_params
    if params[:end_date].present?
      Date.strptime(params[:end_date], Rota.url_date_format)
    end
  end

  def default_end_date
    Time.now.strftime(Rota.url_date_format)
  end

  def default_venue
    current_user.venues.first
  end

  def assert_date_range_valid(start_date, end_date)
    day_delta = ((start_date - end_date) / 1.day).abs
    if (day_delta > 7)
      raise "invalid date range supplied #{start_date} - #{end_date}"
    end
  end

  def rota_date_from_params
    Time.strptime(params.fetch(:id), Rota.url_date_format)
  end

  def venue_from_params
    Venue.find_by(id: params[:venue_id])
  end
end
