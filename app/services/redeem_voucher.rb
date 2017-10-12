class RedeemVoucher
  class Result <  Struct.new(:success, :voucher_usage, :api_errors)
    def success?
      success
    end
  end

  def initialize(voucher:, requester:)
    @voucher = voucher
    @requester = requester
    @ability = Ability.new(requester)
  end
  attr_accessor :voucher, :requester, :ability

  def call(params)
    ability.authorize! :manage, voucher
    staff_member = StaffMember.find(params.fetch(:staff_member_id))

    voucher_usage = VoucherUsage.new(
      creator: requester,
      voucher: voucher,
      staff_member: staff_member,
      enabled: true
    )
    result = voucher_usage.save

    api_errors = nil
    if !result
      api_errors = RedeemVoucherApiErrors.new(voucher_usage: voucher_usage)
    end

    Result.new(result, voucher_usage, api_errors)
  end
end
