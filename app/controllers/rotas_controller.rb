class RotasController < ApplicationController
  before_action :authorize
  before_action :set_new_layout, only: [:index]

  attr_reader :venue

  def index
    respond_to do |format|
      format.html do
        render_rota_index
      end

      format.pdf do
        render_rota_pdf
      end
    end
  end

  def show
    raise ActiveRecord::RecordNotFound unless venue_from_params.present?

    rota = Rota.find_or_initialize_by(
      date: rota_date_from_params,
      venue: venue_from_params
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
    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!

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

  def render_rota_index
    unless highlight_date_from_params.present? && venue_from_params.present?
      return redirect_to(venue_rotas_path(index_redirect_params))
    end

    venue = venue_from_params
    date = highlight_date_from_params
    rota_weekly = RotaWeeklyPageData.new(date: date, venue: venue).call
    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!

    render locals: {
      access_token: access_token,
      accessible_venues: accessible_venues_for(current_user),
      venue: rota_weekly.venue,
      start_date: rota_weekly.week.start_date,
      end_date: rota_weekly.week.end_date,
      weekly_rota_forecast: Api::V1::WeeklyRotaForecastSerializer.new(rota_weekly.weekly_rota_forecasts, scope: { week: rota_weekly.week }),
      rota_weekly_day: Api::V1::RotaWeeklyDaySerializer.new(rota_weekly, scope: { staff_types: StaffType.all }),
    }
  end

  def render_rota_pdf
    unless start_date_from_params.present? && venue_from_params.present?
      return redirect_to(venue_rotas_path(index_redirect_params.merge(format: :pdf)))
    end
    venue = venue_from_params
    start_date = start_date_from_params
    week = RotaWeek.new(start_date)

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

  def highlight_date_from_params
    if params[:highlight_date].present?
      UIRotaDate.parse(params[:highlight_date])
    end
  end

  def start_date_from_params
    if highlight_date_from_params.present?
      RotaWeek.new(highlight_date_from_params).start_date
    end
  end

  def default_highlight_date
    RotaWeek.new(RotaShiftDate.to_rota_date(Time.current)).start_date
  end

  def rota_date_from_params
    UIRotaDate.parse(params.fetch(:id))
  end

  def index_redirect_params
    venue = venue_from_params || current_user.default_venue || Venue.first
    highlight_date = highlight_date_from_params || default_highlight_date
    {
      venue_id: venue.andand.id,
      highlight_date: UIRotaDate.format(highlight_date)
    }
  end

  def accessible_venues
    AccessibleVenuesQuery.new(current_user).all
  end

  def venue_from_params
    @venue_from_params ||= accessible_venues.find_by(id: params[:venue_id])
  end
end
