class UpdateStaffMemberEmploymentDetails
  class Result < Struct.new(:success, :staff_member)
    def success?
      success
    end
  end

  def initialize(staff_member:, params:)
    @staff_member = staff_member
    @params = params
  end

  def call
    result = false

    ActiveRecord::Base.transaction do
      staff_member.assign_attributes(params)
      if staff_member.staff_member_venue.present? && staff_member.staff_member_venue.venue_id == nil
        staff_member.staff_member_venue.mark_for_destruction
      end
      pay_rate_changed = staff_member.pay_rate_id_changed?

      result = staff_member.save

      if result && pay_rate_changed
        rotas = CurrentAndFutureRotasQuery.new(relation: Rota.published).all.
          joins(:rota_shifts).
          merge(
            RotaShift.where(staff_member: staff_member)
          )

        rotas.each do |rota|
          UpdateRotaForecast.new(rota: rota).call
        end
      end
    end

    Result.new(result, staff_member)
  end

  private
  attr_reader :staff_member, :params
end
