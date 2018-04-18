class CreateSecurityShiftRequest
  Result = Struct.new(:success, :security_shift_request) do
    def success?
      success
    end
  end

  def initialize(params:)
    @params = params
  end

  def call
    success = false
    security_shift_request = nil

    ActiveRecord::Base.transaction do
      security_shift_request = SecurityShiftRequest.new(params)
      success = security_shift_request.save
    end

    Result.new(success, security_shift_request)
  end

  private
  attr_reader :security_shift_request, :params
end
