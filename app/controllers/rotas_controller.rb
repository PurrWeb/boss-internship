class RotasController < ApplicationController
  before_action :authorize
<<<<<<< HEAD
  before_filter :check_venue
=======
  before_action :set_venue
  before_action :set_new_layout
>>>>>>> [rota-page] Add react components

  attr_reader :venue

  def index
    if highlight_date_from_params.present?
      highlight_date = highlight_date_from_params
      week = RotaWeek.new(highlight_date)

      respond_to do |format|
        format.html do
          render_rota_index(week: week)
        end

        format.pdf do
          render_rota_pdf(week: week)
        end
      end
    else
      redirect_to(venue_rotas_path(redirect_params))
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

  def render_rota_index(week:)
    date = highlight_date_from_params
    rota_weekly_day_data = RotaWeeklyDayPageData.new(date: date, venue: venue).serialize
    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!

    render locals: {
      access_token: access_token,
      accessible_venues: accessible_venues_for(current_user),
    }.merge(rota_weekly_day_data)
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
      highlight_date: UIRotaDate.format(highlight_date_from_params || default_highlight_date),
    }
  end

  def highlight_date_from_params
    if params[:highlight_date].present?
      UIRotaDate.parse(params[:highlight_date])
    end
  end

  def default_highlight_date
    Time.zone.now.beginning_of_week
  end

  def rota_date_from_params
    UIRotaDate.parse(params.fetch(:id))
  end
  
  def check_venue
    unless venue_from_params.present?
      redirect_to(venue_rotas_path(index_redirect_params))
    end
  end

  def index_redirect_params
    venue = venue_from_params || current_user.default_venue
    {
      venue_id: venue.andand.id
    }
  end

  def venue_from_params
    @venue ||= if current_user.has_all_venue_access?
      Venue.find_by({id: params[:venue_id]})
    else
      current_user.venues.find_by(id: params[:venue_id])
    end
  end
end
