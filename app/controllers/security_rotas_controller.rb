class SecurityRotasController < ApplicationController
  before_action :authorize

  def index
    date = date_from_params
    week = RotaWeek.new(date || Time.now)

    if date && (date == week.start_date)
      render locals: { week: week }
    else
      redirect_to(security_rotas_path(date: UIRotaDate.format(week.start_date)))
    end
  end

  def show
    date = date_from_params(param_name: :id)
    raise ActiveRecord::RecordNotFound unless date.present?

    venues = Venue.all
    staff_types = StaffType.where(role: 'security')
    staff_members = StaffMember.enabled.joins(:staff_type).merge(staff_types)
    holidays = Holiday.in_state(:enabled).joins(:staff_member).merge(staff_members)

    week = RotaWeek.new(date)
    week_start_time = RotaShiftDate.new(week.start_date).start_time
    week_end_time = RotaShiftDate.new(week.end_date).end_time
    rota_shifts = RotaShift.
      enabled.
      joins(:staff_member).
      merge(staff_members).
      where(starts_at: week_start_time..week_end_time)

    date_rotas = Rota.where(date: date)

    shift_rotas = Rota.
      joins('INNER JOIN `rota_shifts` ON `rotas`.`id` = `rota_shifts`.`rota_id`').
      where('`rota_shifts`.`id` IN (?)', rota_shifts.pluck(:id))

    rotas = Rota.where(id: date_rotas.pluck(:id) + shift_rotas.pluck(:id)).uniq

    render locals: {
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
end
