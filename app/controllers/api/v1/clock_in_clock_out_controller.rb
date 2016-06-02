module Api
  module V1
    class ClockInClockOutController < ApplicationController
      skip_before_filter :authenticate_user!

      def index
        api_key = ApiKey.active.find_by(key: params[:api_key])
        raise ActiveRecord::RecordNotFound unless api_key.present?

        venue = api_key.venue
        rota_date = RotaShiftDate.to_rota_date(Time.current)

        staff_members = StaffMember.for_venue(venue).enabled

        clock_in_days = staff_members.map do |staff_member|
          ClockInDay.find_or_initialize_by(
            staff_member: staff_member,
            venue: venue,
            date: rota_date
          )
        end

        rota = Rota.find_or_initialize_by(venue: venue, date: rota_date)

        rota_shifts = rota.rota_shifts.enabled

        staff_types = StaffType.all

        render locals: {
          api_key: api_key,
          rota_date: rota_date,
          staff_members: staff_members,
          clock_in_days: clock_in_days,
          staff_types: staff_types,
          rota_shifts: rota_shifts,
          rotas: [rota],
          venues: [venue],
          venue: venue
        }
      end
    end
  end
end
