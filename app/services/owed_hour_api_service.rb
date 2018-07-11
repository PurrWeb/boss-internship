class OwedHourApiService
  Result = Struct.new(:owed_hour, :success, :api_errors) do
    def success?
      success
    end
  end

  def initialize(owed_hour:, requester:)
    @requester = requester
    @owed_hour = owed_hour
    @ability = UserAbility.new(requester)
  end
  attr_reader :owed_hour, :ability, :requester

  def update(params)
    assert_action_permitted(:update)

    model_service_result = ImmutableOwedHourUpdate.new(
      requester: requester,
      owed_hour: owed_hour,
      params: owed_hour_update_params(params: params)
    ).call
    api_errors = nil
    unless model_service_result.success?
      api_errors = OwedHourApiErrors.new(owed_hour: model_service_result.owed_hour)
    end
    Result.new(model_service_result.owed_hour, model_service_result.success?, api_errors)
  end

  def create(params)
    assert_action_permitted(:create)

    create_owed_hour_params = owed_hour_create_params(params: params)
      .merge(staff_member: owed_hour.staff_member, creator: requester)

    model_service_result = CreateOwedHour.new(
      params: create_owed_hour_params
    ).call

    api_errors = nil
    unless model_service_result.success?
      api_errors = OwedHourApiErrors.new(owed_hour: model_service_result.owed_hour)
    end
    Result.new(model_service_result.owed_hour, model_service_result.success?, api_errors)
  end

  def destroy
    assert_action_permitted(:destroy)
    
    model_service_result = DeleteOwedHour.new(
      requester: requester,
      owed_hour: owed_hour,
    ).call
    
    api_errors = nil
    unless model_service_result.success?
      api_errors = OwedHourApiErrors.new(holiday: owed_hour)
    end
    Result.new(owed_hour, model_service_result.success?, api_errors)
  end

  private

  def owed_hour_create_params(params:)
    date = params.fetch(:date)
    starts_at = starts_at_param(date: date, starts_at: params.fetch(:starts_at))
    ends_at = ends_at_param(date: date, ends_at: params.fetch(:ends_at))
    minutes = (starts_at.present? && ends_at.present?) && ((ends_at - starts_at) / 60)
    {
      date: date,
      starts_at: starts_at,
      ends_at: ends_at,
      minutes: minutes,
      note: params[:note]
    }
  end

  def owed_hour_update_params(params:)
    payslip_date = params.fetch(:payslip_date)
    owed_hour_create_params(params: params).merge(
      payslip_date: payslip_date,
    )
  end

  def starts_at_param(date:, starts_at:)
    unless date.present?
      if starts_at.present?
        return starts_at.minutes 
      end
      return nil
    end
    RotaShiftDate.new(date).start_time + starts_at.minutes
  end

  def ends_at_param(date:, ends_at:)
    unless date.present?
      if ends_at.present?
        return ends_at.minutes 
      end
      return nil
    end
    RotaShiftDate.new(date).start_time + ends_at.minutes
  end

  def assert_action_permitted(action)
    case action
    when :create
      ability.authorize!(:create, owed_hour)
    when :update
      ability.authorize!(:update, owed_hour)
    when :destroy
      ability.authorize!(:destroy, owed_hour)
    else
      raise "unsupported action: #{action} supplied"
    end
  end
end
