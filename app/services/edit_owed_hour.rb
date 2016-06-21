class EditOwedHour
  Result = Struct.new(:success, :owed_hour) do
    def success?
      success
    end
  end

  def initialize(requester:, owed_hour:, params:)
    @requester = requester
    @owed_hour = owed_hour
    @params = params
    assert_params
  end

  def call
    return Result.new(true) if !attributes_changed

    success = false
    ActiveRecord::Base.transaction do
      owed_hour.disable!(requester: requester)

      new_owed_hour = OwedHour.new(
        copy_params.
          merge(update_params).
          merge(creator: requester)
      )
      success = new_owed_hour.save
      raise ActiveRecord::Rollback unless success

      owed_hour.update_attributes!(parent: new_owed_hour)
    end

    if !success
      owed_hour.reload
      owed_hour.assign_attributes(update_params)
      owed_hour.valid?
    end

    Result.new(success, owed_hour)
  end

  private
  attr_reader :requester, :owed_hour, :params

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
end
