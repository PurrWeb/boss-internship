class EditOldHour
  Result = Struct.new(:success, :old_hour) do
    def success?
      success
    end
  end

  def initialize(requester:, old_hour:, params:)
    @requester = requester
    @old_hour = old_hour
    @params = params
    assert_params
  end

  def call
    return Result.new(true) if !attributes_changed

    success = false
    ActiveRecord::Base.transaction do
      old_hour.disable!(requester: requester)

      new_old_hour = OldHour.new(
        copy_params.
          merge(update_params).
          merge(creator: requester)
      )
      success = new_old_hour.save
      raise ActiveRecord::Rollback unless success

      old_hour.update_attributes!(parent: new_old_hour)
    end

    if !success
      old_hour.reload
      old_hour.assign_attributes(update_params)
      old_hour.valid?
    end

    Result.new(success, old_hour)
  end

  private
  attr_reader :requester, :old_hour, :params

  def assert_params
    if params.keys.map(&:to_sym).sort != edit_attributes.sort
      raise ArgumentError.new(":week_start_date, :minutes, :note old hour params required, got:#{params.keys}")
    end
  end

  def edit_attributes
    [:week_start_date, :minutes, :note]
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
        result[attribute] = old_hour.public_send(attribute)
      end
      result[:staff_member] = old_hour.staff_member
      result
    end
  end

  def attributes_changed
    update_params.keys.any? do |key|
      old_hour.public_send(key) != update_params[key]
    end
  end
end
