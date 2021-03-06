# Takes an persisted owed hour object and peforms an 'imutable update' using a second
# unpersisted owed hour record to take it's place. This service performs the disabling
# of the old record and links it with the new one.
class ImmutableOwedHourUpdate
  Result = Struct.new(:success, :owed_hour) do
    def success?
      success
    end
  end

  def initialize(requester:, owed_hour:, params:, nested: false)
    @requester = requester
    @owed_hour = owed_hour
    @params = params
    @nested = nested
    assert_params
  end

  def call
    success = false
    new_owed_hour = nil

    ActiveRecord::Base.transaction(requires_new: nested) do
      new_owed_hour = OwedHour.new(
        copy_params.
          merge(update_params).
          merge(creator: requester)
      )
      assert_owed_hours_valid(owed_hour, new_owed_hour)
      if owed_hours_match?(owed_hour, new_owed_hour)
        success = true
        return Result.new(success, owed_hour)
      else
        owed_hour.disable!(requester: requester)

        staff_member = owed_hour.staff_member
        if new_owed_hour.payslip_date.present? && owed_hour.payslip_date.present? && staff_member.can_have_finance_reports?
          finance_report = nil
          old_week = RotaWeek.new(owed_hour.payslip_date)
          new_week = RotaWeek.new(new_owed_hour.payslip_date)

          finance_report = MarkFinanceReportRequiringUpdate.new(staff_member: staff_member, week: old_week).call
          if old_week.start_date != new_week.start_date
            finance_report = MarkFinanceReportRequiringUpdate.new(staff_member: staff_member, week: new_week).call
          end

          new_owed_hour.assign_attributes(finance_report: finance_report)
        end
        success = new_owed_hour.save

        raise ActiveRecord::Rollback unless success
        owed_hour.update_attributes!(parent: new_owed_hour)
      end
    end

    if !success
      owed_hour.reload
      owed_hour.assign_attributes(update_params)
      owed_hour.valid?
      Result.new(success, new_owed_hour)
    else
      Result.new(success, new_owed_hour)
    end
  end

  private
  attr_reader :requester, :owed_hour, :params, :nested

  def edit_attributes
    [:date, :payslip_date, :starts_at, :ends_at, :note, :minutes]
  end

  def assert_params
    if params.keys.map(&:to_sym).sort != edit_attributes.sort
      raise ArgumentError.new("invalid owed hours params required: #{edit_attributes.to_s} got:#{params.keys}")
    end
  end

  def owed_hours_match?(owed_hour_1, owed_hour_2)
    [:date, :payslip_date, :minutes, :note].all? do |attribute|
      owed_hour_1.public_send(attribute) == owed_hour_2.public_send(attribute)
    end
  end

  def update_params
    @update_params ||= begin
      result = {}
      edit_attributes.each do |attribute|
        result[attribute] = params[attribute]
      end
      result
    end
  end

  def copy_params
    @copy_params ||= begin
      result = {}
      edit_attributes.each do |attribute|
        result[attribute] = owed_hour.public_send(attribute)
      end
      result[:staff_member] = owed_hour.staff_member
      result
    end
  end

  def attributes_changed
    update_params.keys.any? do |key|
      owed_hour.public_send(key) != update_params[key]
    end
  end

  def assert_owed_hours_valid(old_owed_hour, new_owed_hour)
    raise ArgumentError.new("old_owed_hour must be enabled") unless old_owed_hour.enabled?
    raise ArgumentError.new("old_owed_hour must be persisted") unless old_owed_hour.persisted?
    raise ArgumentError.new("new_owed_hour must be unpersisted") if new_owed_hour.persisted?
    raise ArgumentError.new("old and new old hours must be for some staff member") unless old_owed_hour.staff_member.id == new_owed_hour.staff_member.id
  end
end
