class EditHoliday
  Result = Struct.new(:success, :holiday) do
    def success?
      success
    end
  end

  def initialize(requester:, holiday:, params:)
    @requester = requester
    @holiday = holiday
    @params = params
    assert_params
  end

  def call
    if !holiday.editable?
      holiday.errors.add(:base, "holiday is not editable")
      return Result.new(false, holiday)
    elsif !attributes_changed
      Result.new(true, holiday) if !attributes_changed
    else
      success = false
      new_holiday = nil

      ActiveRecord::Base.transaction do
        holiday.disable!(requester: requester)

        new_holiday = Holiday.new(
          copy_params.
            merge(update_params).
            merge(creator: requester)
        )
        success = new_holiday.save

        raise ActiveRecord::Rollback unless success
        holiday.update_attributes!(parent: new_holiday)
      end

      if !success
        holiday.reload
        holiday.assign_attributes(update_params)
        holiday.valid?
        Result.new(success, new_holiday)
      else
        Result.new(success, new_holiday)
      end
    end
  end

  private
  attr_reader :requester, :holiday, :params

  def assert_params
    if params.keys.map(&:to_sym).sort != edit_attributes.sort
      raise ArgumentError.new(":start_date, :payslip_date, :end_date :holiday_type :note holiday params required, got:#{params.keys}")
    end
  end

  def edit_attributes
    [:start_date, :end_date, :payslip_date, :holiday_type, :note]
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
        result[attribute] = holiday.public_send(attribute)
      end
      result[:staff_member] = holiday.staff_member
      result
    end
  end

  def attributes_changed
    update_params.keys.any? do |key|
      holiday.public_send(key) != update_params[key]
    end
  end
end
