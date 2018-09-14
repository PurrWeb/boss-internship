module Api
  module V1
    class ClockInClockOutController < ApplicationController
      skip_before_filter :authenticate_user!

      def index
        api_key = ApiKey.boss.active.find_by(key: params[:api_key])

        if api_key.present?
          venue = api_key.venue
          rota_date = RotaShiftDate.to_rota_date(Time.current)

          rota = Rota.find_or_initialize_by(
            venue: venue,
            date: rota_date,
          )

          rota_shifts = rota.rota_shifts.enabled.includes(:staff_member)

          staff_members = ClockableStaffMembersQuery.new(
            venue: venue,
            rota_shifts: rota_shifts,
          ).all.includes([:master_venue, :staff_type, :name, :work_venues])

          staff_with_holidays_ids = InRangeQuery.new(
            relation: Holiday.in_state(:enabled).where(staff_member: staff_members),
            start_value: rota_date,
            end_value: rota_date,
            start_column_name: "start_date",
            end_column_name: "end_date",
          ).all.pluck(:staff_member_id).uniq

          clock_in_days = ClockInDay.where(
            staff_member: staff_members,
            venue: venue,
            date: rota_date,
          ).includes([
            :venue, :staff_member, :clock_in_notes,
            :hours_acceptance_periods, :clock_in_periods,
          ]).to_a

          total_staff_member_ids = staff_members.map(&:id)
          staff_member_ids_with_clock_in_days = clock_in_days.map(&:staff_member_id)
          staff_member_ids_without_clock_in_days = total_staff_member_ids - staff_member_ids_with_clock_in_days

          new_clock_in_days = staff_member_ids_without_clock_in_days.map do |staff_member_id|
            ClockInDay.new(
              staff_member_id: staff_member_id,
              venue: venue,
              date: rota_date,
            )
          end

          clock_in_days = clock_in_days + new_clock_in_days

          clock_in_notes = ClockInNote.where(
            clock_in_day_id: clock_in_days,
          )

          render json: venue, serializer: Api::V1::ClockInClockOutSerializer, scope: {
            api_key: api_key,
            rota_date: rota_date,
            staff_members: staff_members,
            staff_with_holidays_ids: staff_with_holidays_ids,
            clock_in_days: clock_in_days,
            clock_in_notes: clock_in_notes,
            staff_types: StaffType.all,
            rota_shifts: rota_shifts,
            rotas: [rota],
            venues: [venue],
          }
        else
          render json: {errors: "API Key Invalid"}, status: :unauthorized
        end
      end
    end
  end
end
