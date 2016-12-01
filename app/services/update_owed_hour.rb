# Takes an persisted owed hour object and peforms an 'imutable update' using a second
# unpersisted owed hour record to take it's place. This service performs the disabling
# of the old record and links it with the new one.
class UpdateOwedHour
  def initialize(requester:, old_owed_hour:, new_owed_hour:)
    @requester = requester
    @old_owed_hour = old_owed_hour
    @new_owed_hour = new_owed_hour
  end

  def call
    assert_owed_hours_valid(old_owed_hour, new_owed_hour)
    return if owed_hours_match?(old_owed_hour, new_owed_hour)

    ActiveRecord::Base.transaction do
      old_owed_hour.disable!(requester: requester)
      new_owed_hour.update_attributes!(creator: requester)
      old_owed_hour.update_attributes!(parent: new_owed_hour)
    end
  end

  private
  attr_reader :requester, :old_owed_hour, :new_owed_hour

  def owed_hours_match?(owed_hour_1, owed_hour_2)
    [:week_start_date, :minutes, :note].all? do |attribute|
      owed_hour_1.public_send(attribute) == owed_hour_2.public_send(attribute)
    end
  end

  def assert_owed_hours_valid(old_owed_hour, new_owed_hour)
    raise ArgumentError.new("old_owed_hour must be enabled") unless old_owed_hour.enabled?
    raise ArgumentError.new("old_owed_hour must be persisted") unless old_owed_hour.persisted?
    raise ArgumentError.new("new_owed_hour must be unpersisted") if new_owed_hour.persisted?
    raise ArgumentError.new("old and new old hours must be for some staff member") unless old_owed_hour.staff_member.id == new_owed_hour.staff_member.id
  end
end
