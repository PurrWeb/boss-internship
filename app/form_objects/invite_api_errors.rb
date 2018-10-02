class InviteApiErrors
  def initialize(invite:)
    @invite = invite
  end
  attr_reader :invite

  def errors
    result = {}
    if invite.present?
      result[:base] = invite.errors[:base] if invite.errors[:base].present?
      result[:role] = invite.errors[:role] if invite.errors[:role].present?
      result[:email] = invite.errors[:email] if invite.errors[:email].present?
      result[:firstName] = invite.errors[:first_name] if invite.errors[:first_name].present?
      result[:surname] = invite.errors[:surname] if invite.errors[:surname].present?
    else
      result[:base] = ["Invite must be present"]
    end
    result
  end
end
