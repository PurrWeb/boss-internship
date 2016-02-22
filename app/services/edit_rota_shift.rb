class EditRotaShift
  class Result < Struct.new(:success, :rota_shift)
    def success?
      success
    end
  end

  def initialize(rota_shift:, rota_shift_params:)
    @rota_shift = rota_shift
    @rota_shift_params = rota_shift_params
  end

  def call
    result = false
    ActiveRecord::Base.transaction do
      result = rota_shift.update_attributes(rota_shift_params)

      if result && rota_shift.rota_published?
        rota_shift.staff_member.mark_requiring_notification!
      end

      ActiveRecord::Rollback unless result
    end

    Result.new(result, rota_shift)
  end

  private
  attr_reader :rota_shift, :rota_shift_params
end
