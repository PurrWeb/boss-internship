# Returns all staff members required to render a rota

class RotaStaffMemberQuery
  def initialize(rota)
    @rota = rota
  end

  def all
    venue_staff_member_ids = StaffMember.for_venue(rota.venue).enabled
    shift_staff_member_ids = StaffMember.joins(:rota_shifts).merge(RotaShift.enabled.where(rota: rota)).pluck(:id)
    ids = (venue_staff_member_ids + shift_staff_member_ids).uniq

    StaffMember.where(id: ids)
  end

  private
  attr_reader :rota
end
