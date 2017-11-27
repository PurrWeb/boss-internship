class SecurityAppUpdateService
  def initialize(serializer: nil)
    @updates = {}
    @deletes = {}
    @serializer = serializer
  end

  def update_shift(shift:)
    @updates[:shifts] ||= {}
    @updates[:shifts][shift.id] = shift
  end

  def update_staff_member_profile(staff_member:)
    @updates[:staff_members] ||= {}
    @updates[:staff_members][staff_member.id] = staff_member
  end

  def delete_shift(shift:)
    @deletes[:shifts] ||= {}
    @deletes[:shifts][shift.id] = shift
  end

  def call
    AblyService.new(serializer: @serializer).security_app_data_update(
      updates: @updates,
      deletes: @deletes,
    )
  end
end
