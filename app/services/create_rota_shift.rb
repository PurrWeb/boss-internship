class CreateRotaShift
  class Result < Struct.new(:success, :rota_shift, :api_errors)
    def success?
      success
    end
  end

  def initialize(creator:, frontend_updates:, rota_date:, venue:, rota_shift_params:, authorization_proc:)
    @creator = creator
    @rota = Rota.find_or_initialize_by(date: rota_date, venue: venue)
    @rota_shift_params = rota_shift_params
    @frontend_updates = frontend_updates
    @authorization_proc = authorization_proc
  end

  def call
    result = false
    rota_shift = nil
    api_errors = nil

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

      if result
        rota_shift.staff_member.mark_requiring_notification! if rota_shift.rota_published?
        frontend_updates.create_shift(shift: rota_shift)
        UpdateRotaForecast.new(rota: rota).call if rota_shift.part_of_forecast?
        DailyReport.mark_for_update!(date: rota.date, venue: rota.venue)
      end
      unless result
        api_errors = RotaShiftApiErrors.new(rota_shift: rota_shift)
        ActiveRecord::Rollback
      end
    end

    Result.new(result, rota_shift, api_errors)
  end

  private
  attr_reader :rota, :creator, :rota_shift_params, :authorization_proc, :frontend_updates
end
