class HolidayRequestPagePermissions
  def initialize(requester:, holiday_requests:, ability: UserAbility.new(requester))
    @requester = requester
    @holiday_requests = holiday_requests
    @ability = ability
  end
  attr_reader :requester, :ability

  def holiday_requests
    result = {}
    @holiday_requests.each do |holiday_request|
      result[holiday_request.id] = {
        canAccept: ability.can?(:accept, holiday_request),
        canEdit: ability.can?(:update, holiday_request),
        canReject: ability.can?(:reject, holiday_request),
        canDelete: ability.can?(:destroy, holiday_request)
      }
    end
    result
  end
end
