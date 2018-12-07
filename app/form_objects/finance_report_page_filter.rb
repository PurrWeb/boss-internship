class FinanceReportPageFilter
  SHOW_ALL_FILTER_TYPE = 'show_all'
  FILTER_BY_SALARY_ONLY = 'salary_only'
  FILTER_BY_WITH_OWED_HOURS = 'with_owed_hours'
  FILTER_BY_WITH_HOLIDAYS = 'with_holidays'
  FILTER_BY_WITH_ACCESSORIES = 'with_accessories'
  FILTER_TYPES = [FILTER_BY_SALARY_ONLY, SHOW_ALL_FILTER_TYPE, FILTER_BY_WITH_OWED_HOURS, FILTER_BY_WITH_HOLIDAYS, FILTER_BY_WITH_ACCESSORIES]

  def initialize(requester:, params:, now: Time.current)
    @requester = requester
    @venue = Venue.find_by(id: params[:venue_id]) if params[:venue_id].present?
    date_from_params= params[:id]
    @date = UIRotaDate.parse(date_from_params) if date_from_params.present?
    @week = RotaWeek.new(date) if date.present?
    @filter_type = extract_filter_type(params)
  end
  attr_reader :venue, :date, :week, :filter_type, :requester

  def filter_staff_by_weekly_pay_rate?
    filter_type == FILTER_BY_SALARY_ONLY
  end

  def filter_by_with_holidays?
    filter_type == FILTER_BY_WITH_HOLIDAYS
  end

  def filter_by_with_owed_hours?
    filter_type == FILTER_BY_WITH_OWED_HOURS
  end

  def filter_by_with_accessories?
    filter_type == FILTER_BY_WITH_ACCESSORIES
  end

  def required_params_present?
    venue.present? &&
      date.present?
  end

  def redirect_params
    redirect_venue = venue || requester.default_venue
    rediect_week = week || default_week
    {
      id: UIRotaDate.format(rediect_week.start_date),
      venue_id: redirect_venue.id
    }
  end

  private
  def extract_filter_type(params)
    if params[:filter_type].present?
      if !FILTER_TYPES.include?(params[:filter_type])
        supplied_filter_type_description = params[:filter_type] ? params[:filter_type] : 'nil'
        raise "Unsupported filter type '#{supplied_filter_type_description}' encountered"
      end

      params[:filter_type]
    else
      SHOW_ALL_FILTER_TYPE
    end
  end

  def default_week
    RotaWeek.new(RotaShiftDate.to_rota_date(now) - 1.week)
  end
end
