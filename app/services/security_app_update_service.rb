class SecurityAppUpdateService
  def initialize(ably_service: AblyService.new)
    @updates = {}
    @deletes = {}
    @ably_service = ably_service
  end
  attr_reader :ably_service

  def create_shift(shift:)
    @updates[:shifts] ||= {}
    @updates[:shifts][shift.id] = shift
  end

  def create_security_venue_shift(security_venue_shift:)
    @updates[:security_venue_shifts] ||= {}
    @updates[:security_venue_shifts][security_venue_shift.id] = security_venue_shift
  end

  def update_shift(shift:)
    @updates[:shifts] ||= {}
    @updates[:shifts][shift.id] = shift
  end

  def update_security_venue_shift(security_venue_shift:)
    @updates[:security_venue_shifts] ||= {}
    @updates[:security_venue_shifts][security_venue_shift.id] = security_venue_shift
  end

  def update_staff_member_profile(staff_member:)
    @updates[:staff_members] ||= {}
    @updates[:staff_members][staff_member.id] = staff_member
  end

  def delete_shift(shift:)
    @deletes[:shifts] ||= {}
    @deletes[:shifts][shift.id] = shift
  end

  def delete_security_venue_shift(security_venue_shift:)
    @deletes[:security_venue_shifts] ||= {}
    @deletes[:security_venue_shifts][security_venue_shift.id] = security_venue_shift
  end

  def create_venue(venue:)
    @updates[:venues] ||= {}
    @updates[:venues][venue.id] = venue
  end

  def update_venue(venue:)
    @updates[:venues] ||= {}
    @updates[:venues][venue.id] = venue
  end

  def call
    ably_service.
      security_app_data_update(
        updates: @updates,
        deletes: @deletes
      )
  end

  def self.capability(staff_member:)
    capability = if staff_member.security?
      {
        "#{SecurityAppUpdateService.security_presence_channel}" => ["presence"],
        "#{SecurityAppUpdateService.personal_channel(id: staff_member.id)}" => ["subscribe"]
      }
    elsif staff_member.manager?
      {
        "#{SecurityAppUpdateService.manager_presence_channel}" => ["presence", "subscribe"],
      }
    else
      {}
    end
    capability.to_json
  end

  def self.presence_channel(staff_member:)
    if staff_member.security?
      SecurityAppUpdateService.security_presence_channel
    elsif staff_member.manager?
      SecurityAppUpdateService.manager_presence_channel
    else
      raise "Wrong staff member staff type"
    end
  end

  def self.manager_presence_channel
    "security-app-presence-manager"
  end

  def self.security_presence_channel
    "security-app-presence-security"
  end

  def self.personal_channel(id:)
    "security-app-#{id}"
  end

  def self.manager_channel
    "security-app-manager"
  end
end
