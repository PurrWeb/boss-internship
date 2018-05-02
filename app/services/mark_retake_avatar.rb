class MarkRetakeAvatar
  def initialize(requester:, staff_member:, now: Time.current)
    @requester = requester
    @staff_member = staff_member
    @ability = UserAbility.new(requester)
    @now = now
  end
  attr_reader :requester, :ability, :staff_member, :now

  def call
    ability.authorize!(:mark_retake_avatar, staff_member)

    staff_member.update_attributes!(
      marked_retake_avatar_at: now,
      marked_retake_avatar_user: requester
    )
  end
end
