class AcceptHolidayRequest
  Result = Struct.new(:success, :holiday_request, :created_holiday) do
    def success?
      success
    end
  end

  def initialize(requester:, holiday_request:)
    @requester = requester
    @holiday_request = holiday_request
    @ability = UserAbility.new(requester)
  end

  def call
    success = false
    accept_success = false
    create_holiday_result = nil
    holiday_request_result = nil

    ability.authorize!(:accept, holiday_request)
    ActiveRecord::Base.transaction do
      holiday_params = {
        start_date: holiday_request.start_date,
        end_date: holiday_request.end_date,
        holiday_type: holiday_request.holiday_type,
        note: holiday_request.note,
        validate_as_assignment: true,
      }.merge(staff_member: holiday_request.staff_member, creator: requester)

      create_holiday_result = CreateHoliday.new(
        requester: requester,
        params: holiday_params
      ).call

      if create_holiday_result.success?
        accept_success = holiday_request.state_machine.transition_to(:accepted)
        if accept_success
          holiday_request_result = AssignHolidayRequest
            .new(holiday_request: holiday_request, holiday: create_holiday_result.holiday)
            .call
        end

      end
      success = create_holiday_result.success? || accept_success || holiday_request_result.andand.success?
      raise ActiveRecord::Rollback unless success
    end
    Result.new(success, holiday_request, create_holiday_result.holiday)
  end

  private
  attr_reader :requester, :holiday_request, :ability
end
