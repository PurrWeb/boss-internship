class RotasController < ApplicationController
  before_action :authorize

  def show
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

  def rota_date_from_params
    Time.strptime(params.fetch(:id), Rota.url_date_format)
  end

  def venue_from_params
    Venue.find(params.fetch(:venue_id))
  end
end
