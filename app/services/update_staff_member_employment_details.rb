class UpdateStaffMemberEmploymentDetails
  class Result < Struct.new(:success, :staff_member)
    def success?
      success
    end
  end

  def initialize(now: Time.now, staff_member:, params:)
    @now = now
    @staff_member = staff_member
    @params = params
  end

  def call
    result = false

    ActiveRecord::Base.transaction do
      staff_member.assign_attributes(params)
      pay_rate_changed = staff_member.pay_rate_id_changed?

      if staff_member.staff_member_venue.present? && staff_member.staff_member_venue.venue_id == nil
        staff_member.staff_member_venue.mark_for_destruction
      end

      if staff_member.security? && staff_member.sia_badge_expiry_date_changed?
        if staff_member.sia_badge_expiry_date < now
          # Notification will not be sent
          staff_member.notified_of_sia_expiry_at = now
        else
          # Send notification when in expiry period
          staff_member.notified_of_sia_expiry_at = nil
        end
      end

      result = staff_member.save

      if result && pay_rate_changed
        rotas = CurrentAndFutureRotasQuery.new(relation: Rota.with_forecasts).all.
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
  attr_reader :now, :staff_member, :params
end
