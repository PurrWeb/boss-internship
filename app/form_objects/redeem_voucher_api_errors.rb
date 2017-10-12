class RedeemVoucherApiErrors
  def initialize(voucher_usage:)
    @voucher_usage = voucher_usage
  end
  attr_accessor :voucher_usage

  def errors
    {}
  end
end
