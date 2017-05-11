class RotasController < ApplicationController
  before_action :authorize
  before_action :set_venue

  attr_reader :venue

  def index
    if start_date_from_params.present? && venue.present?
      start_date = start_date_from_params
      week = RotaWeek.new(start_date)

      respond_to do |format|
        format.html do
          render_rota_index(week: week)
        end

        format.pdf do
          render_rota_pdf(week: week)
        end
      end
    else
      redirect_to(rotas_path(redirect_params))
    end
  end

  def show
    raise ActiveRecord::RecordNotFound unless venue.present?

    rota = Rota.find_or_initialize_by(
      date: rota_date_from_params,
      venue: venue
    )

    authorize!(:manage, rota)

    week = RotaWeek.new(rota.date)
    staff_members = RotaStaffMemberQuery.new(
      rota
    ).all.includes([:master_venue, :staff_type, :name, :work_venues])

    holidays = Holiday.in_state(:enabled).where(
      staff_member: staff_members
    )

    holidays = HolidayInRangeQuery.new(
      relation: holidays,
      start_date: week.start_date,
      end_date: week.end_date
    ).all.includes([:staff_member, :holiday_transitions])

    week_start_time = RotaShiftDate.new(week.start_date).start_time
    week_end_time = RotaShiftDate.new(week.end_date).end_time

    rota_shifts = RotaShift.enabled.where(
      staff_member: staff_members,
      starts_at: week_start_time..week_end_time
    ).includes([:rota, :staff_member])

    rotas = Rota.where(
      id: ([rota.id] + rota_shifts.map(&:rota_id)).uniq.compact
    ).includes([:venue, :rota_status_transitions])

    venues = Venue.where(id: [rota.venue_id] + rotas.map(&:venue_id).uniq)
    access_token = current_user.current_access_token || AccessToken.create_web!(user: current_user)

    render locals: {
      access_token: access_token,
      current_rota: rota,
      rotas: rotas,
      rota_shifts: rota_shifts,
      staff_members: staff_members,
      holidays: holidays,
      venues: venues,
      staff_types: StaffType.all
    }
  end

  private

  def render_rota_index(week:)
    rotas = (week.start_date..week.end_date).map do |date|
      Rota.find_or_initialize_by(
        date: date,
        venue: venue
      )
    end
    ActiveRecord::Associations::Preloader.new.preload(
      rotas, [:enabled_rota_shifts, :venue]
    )

    rota_forecasts = rotas.map do |rota|
      forecast = RotaForecast.where(rota: rota).last

      if !forecast.present?
        forecast = GenerateRotaForecast.new(
          forecasted_take_cents: 0,
          rota: rota
        ).call
      end

      forecast
    end

    weekly_rota_forecast = GenerateWeeklyRotaForecast.new(
      rota_forecasts: rota_forecasts,
      week: week
    ).call

    access_token = current_user.current_access_token || AccessToken.create_web!(user: current_user)

    render locals: {
      access_token: access_token,
      accessible_venues: accessible_venues_for(current_user),
      venue: venue,
      start_date: week.start_date,
      end_date: week.end_date,
      rotas: rotas,
      staff_types: StaffType.all,
      rota_forecasts: rota_forecasts,
      week: week,
      weekly_rota_forecast: weekly_rota_forecast
    }
  end

  def render_rota_pdf(week:)
    pdf = RotaPDF.new(RotaPDFTableData.new(week: week, venue: venue))
    #TODO: Extract File Timestamp Format to somewhere
    timestamp_start = week.start_date.strftime('%d-%b-%Y')
    timestamp_end = week.end_date.strftime('%d-%b-%Y')
    filename  = "#{venue.name.parameterize}_rota_#{timestamp_start}_#{timestamp_end}.pdf"
    headers['Content-Disposition'] = "attachment; filename=#{filename}"
    render text: pdf.render, content_type: 'application/pdf'
  end

  def authorize
    authorize! :manage, :rotas
  end

  def accessible_venues_for(user)
    AccessibleVenuesQuery.new(user).all
  end

  def redirect_params
    {
      start_date: UIRotaDate.format(start_date_from_params || default_start_date),
      venue_id: venue || current_user.default_venue.andand.id
    }
  end

  def start_date_from_params
    if params[:start_date].present?
      UIRotaDate.parse(params[:start_date])
    end
  end

  def default_start_date
    Time.zone.now.beginning_of_week
  end

  def end_date_from_params
    if params[:end_date].present?
      UIRotaDate.parse(params[:end_date])
    end
  end

  def default_end_date
    Time.zone.now.end_of_week
  end

  def rota_date_from_params
    UIRotaDate.parse(params.fetch(:id))
  end

  def set_venue
    @venue ||= Venue.find_by(id: params[:venue_id])
  end
end
