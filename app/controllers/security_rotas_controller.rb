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

    rotas = Rota.where(date: date)
    venues = Venue.all
    staff_types = StaffType.where(role: 'security')
    staff_members = StaffMember.enabled.joins(:staff_type).merge(staff_types)
    rota_shifts = RotaShift.enabled.joins(:rota).merge(rotas).joins(:staff_member).merge(staff_members)
    holidays = Holiday.in_state(:enabled).joins(:staff_member).merge(staff_members)

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
