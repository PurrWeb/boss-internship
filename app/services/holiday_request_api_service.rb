class HolidayRequestApiService
  Result = Struct.new(:holiday_request, :success, :api_errors) do
    def success?
      success
    end
  end

  def initialize(requester:, holiday_request:)
    @requester = requester
    @holiday_request = holiday_request
    @ability = UserAbility.new(requester)
  end
  attr_reader :holiday_request, :requester, :ability

  def create(params:)
    holiday_request_params = {
      start_date: UIRotaDate.parse_if_present(params.fetch(:start_date)),
      end_date: UIRotaDate.parse_if_present(params.fetch(:end_date)),
      holiday_type: params.fetch(:holiday_type),
      note: params[:note]
    }.merge(staff_member: holiday_request.staff_member, creator: requester)

    result  = CreateHolidayRequest.new(params: holiday_request_params, requester: requester).call

    api_errors = nil
    unless result.success?
      api_errors = HolidayRequestApiErrors.new(holiday_request: result.holiday_request, holiday: holiday_request.created_holiday)
    end
    Result.new(result.holiday_request, result.success?, api_errors)
  end

  def destroy
    result = DeleteHolidayRequest.new(
      requester: requester,
      holiday_request: holiday_request,
    ).call

    api_errors = nil
    unless result.success?
      api_errors = HolidayRequestApiErrors.new(holiday_request: holiday_request, holiday: holiday_request.created_holiday)
    end
    Result.new(holiday_request, result.success?, api_errors)
  end

  def update(params)
    holiday_request_params = {
      start_date: UIRotaDate.parse_if_present(params.fetch(:start_date)),
      end_date: UIRotaDate.parse_if_present(params.fetch(:end_date)),
      holiday_type: params.fetch(:holiday_type),
      note: params[:note]
    }

    result = EditHolidayRequest.new(
      requester: requester,
      holiday_request: holiday_request,
      params: holiday_request_params
    ).call

    api_errors = nil
    unless result.success?
      api_errors = HolidayRequestApiErrors.new(holiday_request: result.holiday_request, holiday: holiday_request.created_holiday)
    end
    Result.new(result.holiday_request, result.success?, api_errors)
  end

  def accept
    result = AcceptHolidayRequest.new(
      requester: requester,
      holiday_request: holiday_request,
    ).call

    api_errors = nil
    unless result.success?
      api_errors = HolidayRequestApiErrors.new(holiday_request: holiday_request, holiday: result.created_holiday)
    end
    Result.new(holiday_request, result.success?, api_errors)
  end

  def reject
    result = RejectHolidayRequest.new(
      requester: requester,
      holiday_request: holiday_request,
    ).call

    api_errors = nil
    unless result.success?
      api_errors = HolidayRequestApiErrors.new(holiday_request: holiday_request)
    end
    Result.new(holiday_request, result.success?, api_errors)
  end
end
