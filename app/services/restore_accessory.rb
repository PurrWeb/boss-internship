class RestoreAccessory
  Result = Struct.new(:success, :accessory) do
    def success?
      success
    end
  end

  def initialize(accessory:)
    @accessory = accessory
  end

  def call
    success = false

    ActiveRecord::Base.transaction do
      success = accessory.update(disabled_at: nil)
      raise ActiveRecord::Rollback unless success
    end

    Result.new(success, accessory)
  end

  private
  attr_reader :accessory
end
