class CreateRotaShift
  class Result < Struct.new(:success, :rota_shift)
    def success?
      success
    end
  end

  def initialize(creator:, rota_date:, venue:, rota_shift_params:, authorization_proc:)
    @creator = creator
    @rota = Rota.find_or_initialize_by(date: rota_date, venue: venue)
    @rota_shift_params = rota_shift_params
    @authorization_proc = authorization_proc
  end

  def call
    result = false
    rota_shift = nil

    ActiveRecord::Base.transaction do
      if !rota.persisted?
        rota.assign_attributes(creator: creator)
      end

      rota_shift = RotaShift.new(
        rota_shift_params.merge(
          creator: creator,
          rota: rota
        )
      )

      authorization_proc.call(rota_shift)

      rota.save!
      result = rota_shift.save

      if result && rota_shift.rota_published?
        rota_shift.staff_member.mark_requiring_notification!
      end

      ActiveRecord::Rollback unless result
    end

    Result.new(result, rota_shift)
  end

  private
  attr_reader :rota, :creator, :rota_shift_params, :authorization_proc
end
