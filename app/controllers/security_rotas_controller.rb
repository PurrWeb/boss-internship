class SecurityRotasController < ApplicationController
  before_action :authorize
  before_action :set_new_layout

  def index
    respond_to do |format|
      format.html do
        render_security_rota_index
      end
      format.pdf do
        render_security_rota_pdf
      end
    end
  end

  def show
    date = rota_date_from_params
    raise ActiveRecord::RecordNotFound unless date.present?

    venues = Venue.all
    staff_types = StaffType.where(role: 'security')

    staff_members = StaffMember.
      enabled.
      joins(:staff_type).
      merge(staff_types).
      includes(:name).
      includes(:staff_type).
      includes(:master_venue).
      uniq


    week = RotaWeek.new(date)
    week_start_time = RotaShiftDate.new(week.start_date).start_time
    week_end_time = RotaShiftDate.new(week.end_date).end_time

    holidays = Holiday.in_state(:enabled).where(
      staff_member: staff_members
    )

    holidays = HolidayInRangeQuery.new(
      relation: holidays,
      start_date: week.start_date,
      end_date: week.end_date
    ).all.includes([:staff_member, :holiday_transitions])

    week_rota_shifts = RotaShift.
      enabled.
      joins(:staff_member).
      merge(staff_members).
      where(starts_at: week_start_time..week_end_time).
      includes(:rota)

    rotas = Rota.where(date: date)

    rota_shifts = RotaShift.enabled.where(
      rota: rotas,
      staff_member: staff_members,
    ).includes([:rota, :staff_member])

    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!

    render locals: {
      access_token: access_token,
      date: date,
      rotas: rotas,
      venues: venues,
      staff_types: staff_types,
      staff_members: staff_members,
      rota_shifts: rota_shifts,
      week_rota_shifts: week_rota_shifts,
      holidays: holidays,
      staff_types: staff_types,
    }
  end

  private
  def authorize
    authorize! :view, :security_rota
  end

  def render_security_rota_index
    unless highlight_date_from_params.present?
      return redirect_to(security_rotas_path(index_redirect_params))
    end

    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
    date = highlight_date_from_params
    week = RotaWeek.new(date)
    rotas = Rota.where(
      date: date,
    )

    staff_types = StaffType.where(role: 'security')

    staff_members = StaffMember
      .joins(:staff_type)
      .merge(staff_types)
      .includes(:staff_type)
      .includes(:name)
      .includes(:master_venue)

    rota_shifts = RotaShift
      .enabled
      .joins(:rota)
      .merge(rotas)
      .joins(:staff_member)
      .merge(staff_members)
      .includes(:rota)

    render locals: {
      access_token: access_token,
      accessible_venues: accessible_venues_for(current_user),
      start_date: week.start_date,
      end_date: week.end_date,
      rotas: rotas,
      date: highlight_date_from_params,
      staff_members: staff_members,
      rota_shifts: rota_shifts,
      staff_types: staff_types
    }
  end

  def accessible_venues_for(user)
    AccessibleVenuesQuery.new(user).all
  end

  def highlight_date_from_params
    if params[:highlight_date].present?
      UIRotaDate.parse(params[:highlight_date])
    end
  end

  def index_redirect_params
    highlight_date = highlight_date_from_params || default_highlight_date
    {
      highlight_date: UIRotaDate.format(highlight_date)
    }
  end

  def default_highlight_date
    RotaWeek.new(RotaShiftDate.to_rota_date(Time.current)).start_date
  end

  def rota_date_from_params
    UIRotaDate.parse(params.fetch(:id))
  end

  def render_security_rota_pdf(week:)
    pdf = RotaPDF.new(SecurityRotaPDFTableData.new(week))
    #TODO: Extract File Timestamp Format to somewhere
    timestamp_start = week.start_date.strftime('%d-%b-%Y')
    timestamp_end = week.end_date.strftime('%d-%b-%Y')
    filename  = "security-rota_#{timestamp_start}_#{timestamp_end}.pdf"
    headers['Content-Disposition'] = "attachment; filename=#{filename}"
    render text: pdf.render, content_type: 'application/pdf'
  end
end
