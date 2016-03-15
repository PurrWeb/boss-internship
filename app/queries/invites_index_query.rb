class InvitesIndexQuery
  def initialize(status:, role: ,relation: Invite.unscoped)
    @status = status
    @relation = relation
    @role = role
  end
  attr_reader :status, :role

  def all
    @all ||= begin
      result = relation
      result = result.in_state(status) if status.present?
      result = result.where(role: role) if role.present?
      result = result.order(:created_at)
      result
    end
  end

  private
  attr_reader :relation
end
