class EditRotaShift
  class Result < Struct.new(:success, :rota_shift, :api_errors)
    def success?
      success
    end
  end

  def initialize(rota_shift:, rota_shift_params:, frontend_updates:)
    @rota_shift = rota_shift
    @rota_shift_params = rota_shift_params
    @frontend_updates = frontend_updates
  end

  def call
    result = false
    api_errors = nil
    
    ActiveRecord::Base.transaction do
      result = rota_shift.update_attributes(rota_shift_params)

      if result
        frontend_updates.update_shift(shift: rota_shift)

        rota_shift.staff_member.mark_requiring_notification! if rota_shift.rota_published?
        UpdateRotaForecast.new(rota: rota_shift.rota).call if rota_shift.part_of_forecast?

        DailyReport.mark_for_update!(
          date: rota_shift.rota.date,
          venue: rota_shift.rota.venue
        )
      end

      unless result
        api_errors = RotaShiftApiErrors.new(rota_shift: rota_shift)
        ActiveRecord::Rollback
      end
    end

    Result.new(result, rota_shift, api_errors)
  end

  private
  attr_reader :rota_shift, :rota_shift_params, :frontend_updates
end
