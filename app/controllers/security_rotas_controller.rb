class SecurityRotasController < ApplicationController
  before_action :authorize

  def index
    date = date_from_params
    week = RotaWeek.new(date || RotaShiftDate.to_rota_date(Time.current))

    if date && (date == week.start_date)
      respond_to do |format|
        format.html do
          access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!

          render locals: {
            access_token: access_token,
            week: week
          }
        end

        format.pdf do
          render_security_rota_pdf(week: week)
        end
      end
    else
      redirect_to(security_rotas_path(date: UIRotaDate.format(week.start_date)))
    end
  end

  def show
    date = date_from_params(param_name: :id)
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

    holidays = Holiday.in_state(:enabled).joins(:staff_member).merge(staff_members)

    week = RotaWeek.new(date)
    week_start_time = RotaShiftDate.new(week.start_date).start_time
    week_end_time = RotaShiftDate.new(week.end_date).end_time
    rota_shifts = RotaShift.
      enabled.
      joins(:staff_member).
      merge(staff_members).
      where(starts_at: week_start_time..week_end_time).
      includes(:rota)

    date_rotas = Rota.where(date: date)

    shift_rotas = Rota.
      joins('INNER JOIN `rota_shifts` ON `rotas`.`id` = `rota_shifts`.`rota_id`').
      where('`rota_shifts`.`id` IN (?)', rota_shifts.pluck(:id))

    rotas = Rota.
      where(id: date_rotas.pluck(:id) + shift_rotas.pluck(:id)).
      includes(:venue).
      uniq

    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!

    render locals: {
      access_token: access_token,
      date: date,
      rotas: rotas,
      venues: venues,
      staff_types: staff_types,
      staff_members: staff_members,
      rota_shifts: rota_shifts,
      holidays: holidays
    }
  end

  private
  def authorize
    authorize! :manage, :security_rota
  end

  def accessible_venues_for(user)
    AccessibleVenuesQuery.new(user).all
  end

  def date_from_params(param_name: :date)
    if params[param_name.to_sym].present?
      UIRotaDate.parse(params[param_name.to_sym])
    end
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
