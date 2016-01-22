class CreateRotaShift
  class Result < Struct.new(:success, :rota_shift)
    def success?
      success
    end
  end

  def initialize(creator:, rota:, rota_shift_params:)
    @creator = creator
    @rota = rota
    @rota_shift_params = rota_shift_params
  end

  def call
    rota_shift = RotaShift.new(create_params)
    Result.new(rota_shift.save, rota_shift)
  end

  private
  attr_reader :rota, :creator, :rota_shift_params

  def create_params
    rota_shift_params.merge(
      creator: creator,
      rota: rota
    )
  end
end
