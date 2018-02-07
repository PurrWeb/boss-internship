class UpdateAccessory
  Result = Struct.new(:success, :accessory) do
    def success?
      success
    end
  end

  def initialize(accessory:, params:)
    @params = params
    @accessory = accessory
  end

  def call
    success = false

    ActiveRecord::Base.transaction do
      success = accessory.update_attributes(params)
      raise ActiveRecord::Rollback unless success
    end

    Result.new(success, accessory)
  end

  private
  attr_reader :accessory, :params
end
