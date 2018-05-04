class SecurityShiftRequestsPermissions
  def initialize(current_user:, shift_requests: [], user_ability: UserAbility.new(current_user))
    @user_ability = UserAbility.new(current_user)
    @shift_requests = shift_requests
    @current_user = current_user
  end
  attr_reader :user_ability, :shift_requests, :current_user

  def shift_request(request:)
    {
      isEditable: user_ability.can?(:edit, request),
      isRejectable: user_ability.can?(:reject, request),
      isAcceptable: user_ability.can?(:accept, request),
      isAssignable: user_ability.can?(:assign, request),
      isUndoable: user_ability.can?(:undo, request),
      isDeletable: user_ability.can?(:delete, request),
    }
  end

  def shift_requests
    result = {}
    @shift_requests.each do |shift_request|
      result[shift_request.id] = {
        isEditable: user_ability.can?(:edit, shift_request),
        isRejectable: user_ability.can?(:reject, shift_request),
        isAcceptable: user_ability.can?(:accept, shift_request),
        isAssignable: user_ability.can?(:assign, shift_request),
        isUndoable: user_ability.can?(:undo, shift_request),
        isDeletable: user_ability.can?(:delete, shift_request),
      }
    end
    result
  end
end
