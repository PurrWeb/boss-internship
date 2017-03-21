# Returns all staff members required to render a rota

class RotaStaffMemberQuery
  def initialize(rota)
    @rota = rota
  end

  def all
    venue_staff_member_ids = StaffMember.for_venue(rota.venue).enabled.map(&:id)
    shift_staff_member_ids = StaffMember.joins(:rota_shifts).where(
      rota_shifts: {
        enabled: true,
        rota: rota
      }
    ).map(&:id)

    StaffMember.where(id: venue_staff_member_ids + shift_staff_member_ids)
  end

  private
  attr_reader :rota
end
