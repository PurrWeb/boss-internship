class FrontendUpdates
  def initialize(security_app_update_service: SecurityAppUpdateService.new)
    wipe_values
    @security_app_update_service = security_app_update_service
  end

  def dispatch
  end

  def create_shift(shift:)
    created_shifts[shift.id] ||= {}
    created_shifts[shift.id][:shift] = shift
  end

  def update_shift(shift:, params: {})
    if shift_pending_create?(shift: shift)
      created_shifts[shift.id][:shift] = shift
    else
      shift_updates[shift.id] ||= {}
      shift_updates[shift.id][:shift] = shift
    end
  end

  def update_staff_member_profile(staff_member:, params: {})
    staff_member_profile_updates[staff_member.id] ||= {}
    staff_member_profile_updates[staff_member.id][:staff_member] = staff_member
  end

  def delete_shift(shift:)
    if shift_pending_create?(shift: shift)
      created_shifts.delete(shift.id)
    else
      shift_updates.delete(shift.id)
      shift_deletes[shift.id] ||= {}
      shift_deletes[shift.id][:shift] = shift
    end
  end

  def publish_rota(rota:)
    rota.rota_shifts.each do |shift|
      shift_updates[shift.id] ||= {}
      shift_updates[shift.id][:shift] = shift
    end
  end

  attr_reader :shift_updates, :shift_deletes, :staff_member_profile_updates, :security_app_update_service, :created_shifts

  def shift_pending_create?(shift:)
    created_shifts[shift.id].present?
  end

  def wipe_values
    @created_shifts = {}
    @shift_updates = {}
    @shift_deletes = {}
    @staff_member_profile_updates = {}
  end
end
