class EditHolidayRequest
  Result = Struct.new(:success, :holiday_request) do
    def success?
      success
    end
  end

  def initialize(requester:, holiday_request:, params:)
    @requester = requester
    @holiday_request = holiday_request
    @params = params
    assert_params
  end

  def call
    if !holiday_request.editable?
      holiday_request.errors.add(:base, "holiday request is not editable")
      return Result.new(false, holiday_request)
    else
      success = false

      ActiveRecord::Base.transaction do
        holiday_request.assign_attributes(update_params)
        success = holiday_request.save

        raise ActiveRecord::Rollback unless success
      end

      Result.new(success, holiday_request)
    end
  end

  private
  attr_reader :requester, :holiday_request, :params

  def assert_params
    if params.keys.map(&:to_sym).sort != edit_attributes.sort
      raise ArgumentError.new(":start_date, :end_date :holiday_type :note holiday params required, got:#{params.keys}")
    end
  end

  def edit_attributes
    [:start_date, :end_date, :holiday_type, :note]
  end

  def update_params
    @update_params ||= begin
      result = {}
      edit_attributes.each do |attribute|
        result[attribute] = params[attribute]
      end
      result
    end
  end
end
