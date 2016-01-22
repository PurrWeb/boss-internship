class CreateRotaShift
  class Result < Struct.new(:success, :rota_shift)
    def success?
      success
    end
  end

  def initialize(creator:, rota_date:, venue:, rota_shift_params:)
    @creator = creator
    @rota = Rota.find_or_initialize_by(date: rota_date, venue: venue)
    @rota_shift_params = rota_shift_params
  end

  def call
    result = false
    rota_shift = nil

    ActiveRecord::Base.transaction do
      if !rota.persisted?
        rota.update_attributes!(creator: creator)
      end

      rota_shift = RotaShift.new(
        rota_shift_params.merge(
          creator: creator,
          rota: rota
        )
      )
      result = rota_shift.save

      ActiveRecord::Rollback unless result
    end

    Result.new(result, rota_shift)
  end

  private
  attr_reader :rota, :creator, :rota_shift_params
end
