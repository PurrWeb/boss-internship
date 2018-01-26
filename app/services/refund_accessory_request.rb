class RefundAccessoryRequest
  Result = Struct.new(:success, :accessory_refund_request) do
    def success?
      success
    end
  end

  def initialize(params:)
    @params = params
  end

  def call
    success = false

    accessory_refund_request = AccessoryRefundRequest.new(params)
    success = accessory_refund_request.save

    Result.new(success, accessory_refund_request)
  end

  private
  attr_reader :params
end
