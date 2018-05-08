class HolidayApiService
  Result = Struct.new(:holiday, :success, :api_errors) do
    def success?
      success
    end
  end

  def initialize(requester:, holiday:)
    @requester = requester
    @holiday = holiday
    @ability = UserAbility.new(requester)
  end
  attr_reader :holiday, :requester, :ability

  def update(params)
    assert_action_permitted(:update)

    holiday_params = {
      start_date: UIRotaDate.parse_if_present(params.fetch(:start_date)),
      end_date: UIRotaDate.parse_if_present(params.fetch(:end_date)),
      holiday_type: params.fetch(:holiday_type),
      note: params[:note]
    }

    model_service_result = EditHoliday.new(
      requester: requester,
      holiday: holiday,
      params: holiday_params
    ).call

    api_errors = nil
    unless model_service_result.success?
      api_errors = HolidayApiErrors.new(holiday: model_service_result.holiday)
    end
    Result.new(model_service_result.holiday, model_service_result.success?, api_errors)
  end

  def destroy
    assert_action_permitted(:destroy)

    model_service_result = DeleteHoliday.new(
      requester: requester,
      holiday: holiday,
    ).call

    api_errors = nil
    unless model_service_result.success?
      api_errors = HolidayApiErrors.new(holiday: holiday)
    end
    Result.new(holiday, model_service_result.success?, api_errors)
  end

  def create(params)
    assert_action_permitted(:create)

    holiday_params = {
      start_date: UIRotaDate.parse_if_present(params.fetch(:start_date)),
      end_date: UIRotaDate.parse_if_present(params.fetch(:end_date)),
      holiday_type: params.fetch(:holiday_type),
      note: params[:note]
    }.merge(staff_member: holiday.staff_member, creator: requester)

    model_service_result = CreateHoliday.new(
      requester: requester,
      params: holiday_params
    ).call

    api_errors = nil
    unless model_service_result.success?
      api_errors = HolidayApiErrors.new(holiday: model_service_result.holiday)
    end
    Result.new(model_service_result.holiday, model_service_result.success?, api_errors)
  end

  private
  def assert_action_permitted(action)
    case action
    when :create
      ability.authorize!(:create, holiday)
    when :update
      ability.authorize!(:update, holiday)
    when :destroy
      ability.authorize!(:destroy, holiday)
    else
      raise "unsupported action: #{action} supplied"
    end
  end
end
