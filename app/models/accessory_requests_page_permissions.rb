class AccessoryRequestsPagePermissions
  def initialize(
    requester:,
    accessory_requests: AccessoryRequest.none,
    accessory_refund_requests: AccessoryRefundRequest.none,
    ability: UserAbility.new(requester)
  )
    @requester = requester
    @accessory_requests = accessory_requests
    @accessory_refund_requests = accessory_refund_requests
    @ability = ability
  end

  attr_reader :requester, :ability

  def accessory_requests
    result = {}
    @accessory_requests.each do |accessory_request|
      result[accessory_request.id] = {
        canAccept: ability.can?(:accept, :accessories_requests),
        canReject: ability.can?(:reject, :accessories_requests),
        canComplete: ability.can?(:complete, :accessories_requests),
        canUndo: ability.can?(:undo, :accessories_requests)
      }
    end
    result
  end

  def accessory_refund_requests
    result = {}
    @accessory_refund_requests.each do |accessory_refund_request|
      result[accessory_refund_request.id] = {
        canAccept: ability.can?(:accept, accessory_refund_request),
        canReject: ability.can?(:reject, accessory_refund_request),
        canComplete: ability.can?(:complete, accessory_refund_request),
        canUndo: ability.can?(:undo, accessory_refund_request)
      }
    end
    result
  end
end
