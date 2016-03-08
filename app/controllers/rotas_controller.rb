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

      rota_forecasts = rotas.map do |rota|
        forecast = RotaForecast.where(rota: rota).last

        if !forecast.present?
          forecast = GenerateRotaForecast.new(
            forecasted_take: Money.new(0),
            rota: rota
          ).call
        end

        forecast
      end

      weekly_rota_forecast = GenerateWeeklyRotaForecast.new(
        week: RotaWeek.new(start_date),
        venue: venue
      ).call

      render locals: {
        accessible_venues: accessible_venues_for(current_user),
        venue: venue,
        start_date: start_date,
        end_date: end_date,
        rotas: rotas,
        staff_types: StaffType.all,
        rota_forecasts: rota_forecasts,
        weekly_rota_forecast: weekly_rota_forecast
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

    respond_to do |format|
      format.html do
        render_rota_show(rota)
      end

      format.pdf do
        render_rota_pdf(rota)
      end
    end
  end

  private
  def render_rota_show(rota)
    week = RotaWeek.new(rota.date)

    staff_members = RotaStaffMemberQuery.new(rota).all

    holidays = Holiday.
      in_state(:enabled).
      where(staff_member: staff_members)

    holidays = HolidayInRangeQuery.new(
      relation: holidays,
      start_date: week.start_date,
      end_date: week.end_date
    ).all

    week_start_time = RotaShiftDate.new(week.start_date).start_time
    week_end_time = RotaShiftDate.new(week.end_date).end_time
    rota_shifts = RotaShift.
      enabled.
      joins(:staff_member).
      merge(staff_members).
      where(starts_at: week_start_time..week_end_time)

    shift_rotas = Rota.
      joins(:rota_shifts).
      merge(
        rota_shifts
      )

    shift_venues = Venue.
      joins(:rotas).
      merge(
        Rota.where(id: shift_rotas.pluck(:id))
      )

    rotas = Rota.
      where(id: [rota.id] + shift_rotas.pluck(:id)).uniq

    venues = Venue.where('`venues`.id = ?', rota.venue.id).merge(shift_venues).uniq
    render locals: {
      current_rota: rota,
      rotas: rotas,
      rota_shifts: rota_shifts,
      staff_members: staff_members,
      holidays: holidays,
      venues: venues,
      staff_types: StaffType.all
    }
  end

  def render_rota_pdf(rota)
    pdf = RotaPDF.new(RotaPDFTableData.new(rota))
    #TODO: Extract File Timestamp Format to somewhere
    timestamp = rota.date.strftime('%d-%b-%Y-%H-%M')
    filename  = "#{rota.venue.name.to_param}-rota-#{timestamp}.pdf"
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
      end_date: UIRotaDate.format(end_date_from_params || default_end_date),
      venue_id: venue_from_params || default_venue.andand.id
    }
  end

  def start_date_from_params
    if params[:start_date].present?
      UIRotaDate.parse(params[:start_date])
    end
  end

  def default_start_date
    Time.now.beginning_of_week
  end

  def end_date_from_params
    if params[:end_date].present?
      UIRotaDate.parse(params[:end_date])
    end
  end

  def default_end_date
    Time.now.end_of_week
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
