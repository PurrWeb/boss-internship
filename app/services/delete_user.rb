class DeleteUser
  def initialize(
    requester:,
    user:,
    would_rehire:,
    disable_reason: nil,
    now: Time.zone.now
  )
    @requester = requester
    @user = user
    @now = now
    @would_rehire = would_rehire
    @disable_reason = disable_reason
  end

  def call
    ActiveRecord::Base.transaction do
      disable_associated_staff_member
      disable_user
    end
  end

  private
  attr_reader :user, :requester, :would_rehire, :disable_reason, :now

  def disable_associated_staff_member
    if user.staff_member.present? && user.staff_member.enabled?
      DeleteStaffMember.new(
        requester: requester,
        staff_member: user.staff_member,
        now: now,
        would_rehire: would_rehire,
        disable_reason: disable_reason,
        nested: true
      ).call
    end
  end

  def disable_user
    user.
      state_machine.
      transition_to!(
        :disabled,
        requster_user_id: requester.id,
        disable_reason: disable_reason
      )

    if !would_rehire
      user.update_attributes!(would_rehire: false)
    end
  end
end
