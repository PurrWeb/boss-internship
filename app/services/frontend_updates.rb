class FrontendUpdates
  def initialize(security_app_update_service: SecurityAppUpdateService.new)
    @shift_updates = {}
    @shift_deletes = {}
    @staff_member_profile_updates = {}
    @security_app_update_service = security_app_update_service
  end

  def dispatch
    shift_updates.each_value do |shift_update|
      if shift_update.key?(:rota_published?) || shift_update.key?(:shift_updated?)
        security_app_update_service.update_shift(shift: shift_update.fetch(:shift))
      end
    end
    shift_deletes.each_value do |shift_delete|
      security_app_update_service.delete_shift(shift: shift_delete[:shift])
    end
    staff_member_profile_updates.each_value do |staff_member_profile_update|
      security_app_update_service
        .update_staff_member_profile(staff_member: staff_member_profile_update[:staff_member])
    end
    security_app_update_service.call
  end

  def update_shift(shift:, params: {})
    shift_updates[shift.id] ||= {}
    shift_updates[shift.id][:shift_updated?] = true
    shift_updates[shift.id][:shift] = shift
  end

  def update_staff_member_profile(staff_member:, params: {})
    staff_member_profile_updates[staff_member.id] ||= {}
    staff_member_profile_updates[staff_member.id][:staff_member] = staff_member
  end

  def delete_shift(shift:)
    shift_updates.delete(shift.id)
    shift_deletes[shift.id] ||= {}
    shift_deletes[shift.id][:shift] = shift
  end

  def publish_rota(rota:)
    rota.rota_shifts.each do |shift|
      shift_updates[shift.id] ||= {}
      shift_updates[shift.id][:rota_published?] = shift.rota_published?
      shift_updates[shift.id][:shift] = shift
    end
  end

  attr_reader :shift_updates, :shift_deletes, :staff_member_profile_updates, :security_app_update_service
end
