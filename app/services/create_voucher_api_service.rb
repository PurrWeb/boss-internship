class CreateVoucherApiService
  Result = Struct.new(:voucher, :success, :api_errors) do
    def success?
      success
    end
  end

  def initialize(venue:, requester:)
    @venue = venue
    @requester = requester
    @ability = UserAbility.new(requester)
  end
  attr_reader :venue, :ability, :requester

  def call(params)
    ability.authorize!(:create, :vouchers)

    voucher = Voucher.new(
      creator: requester,
      venue: venue,
      description: params.fetch(:description),
      enabled: true
    )

    api_errors = nil

    result = voucher.save
    if !result
      api_errors = CreateVoucherApiErrors.new(voucher: voucher)
    end

    Result.new(voucher, result, api_errors)
  end
end
