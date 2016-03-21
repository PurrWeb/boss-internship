class UIStaffMemberStatus
  def initialize(staff_member)
    @staff_member = staff_member
  end

  def to_s
    if staff_member.flagged?
      '<span class="text-danger">Disabled (Flagged)</span>'.html_safe
    else
      staff_member.current_state.titlecase
    end
  end

  private
  attr_reader :staff_member
end
