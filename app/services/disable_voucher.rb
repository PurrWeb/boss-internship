class DisableVoucher
  def initialize(voucher:, requester:)
    @voucher = voucher
    @requester = requester
    @ability = Ability.new(requester)
  end
  attr_accessor :voucher, :voucher, :ability

  def call
    ability.authorize! :manage, voucher
    raise 'Attempt to disable voucher that is already disabled' unless voucher.enabled?
    voucher.update_attribute(:enabled, false)
    voucher
  end
end
