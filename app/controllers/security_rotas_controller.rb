class SecurityRotasController < ApplicationController
  before_action :authorize

  def index
    date = date_from_params
    week = RotaWeek.new(date || Time.now)

    if date && (date == week.start_date)
      render locals: { start_date: week.start_date, end_date: week.end_date }
    else
      redirect_to(security_rotas_path(date: UIRotaDate.format(week.start_date)))
    end
  end

  def show
    date = date_from_params(param_name: :id)
    raise ActiveRecord::RecordNotFound unless date.present?

    render locals: { date: date }
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
