class CreateAccessory
  Result = Struct.new(:success, :accessory) do
    def success?
      success
    end
  end

  def initialize(params:)
    @params = params
  end

  def call
    success = false
    accessory = nil

    accessory = Accessory.new(params)
    success = accessory.save

    Result.new(success, accessory)
  end

  private
  attr_reader :params
end
