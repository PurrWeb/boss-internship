module Api
  module V1
    class ClockingController < APIController
      before_filter :api_token_athenticate!

      def clock_in
        transition_state(to_state: :clocked_in)
        render nothing: true, status: :ok
      end

      def clock_out
        transition_state(to_state: :clocked_out)
        render nothing: true, status: :ok
      end

      def start_break
        transition_state(to_state: :on_break)
        render nothing: true, status: :ok
      end

      def end_break
        transition_state(to_state: :clocked_in)
        render nothing: true, status: :ok
      end

      def add_note
        staff_member = staff_member_from_params
        venue = venue_from_api_key
        date = date_from_params
        note = params.fetch(:note)

        authorize! :add_note, staff_member


        ActiveRecord::Base.transaction do
          clock_in_day = ClockInDay.find_or_initialize_by(
            venue: venue,
            date: date,
            staff_member: staff_member
          )

          if clock_in_day.new_record?
            clock_in_day.update_attributes!(
              creator: staff_member_from_token
            )
          end

          ClockInNote.create!(
            creator: staff_member_from_token,
            clock_in_day: clock_in_day,
            note: note,
            enabled: true
          )
        end

        render nothing: true, status: :ok
      end

      private
      def transition_state(to_state:)
        staff_member = staff_member_from_params
        venue = venue_from_api_key
        at = Time.current
        date = RotaShiftDate.to_rota_date(at)

        authorize!(:perform_clocking_action, staff_member)

        ActiveRecord::Base.transaction do
          clock_in_day = ClockInDay.find_or_initialize_by(
            venue: venue,
            date: date,
            staff_member: staff_member
          )

          if clock_in_day.new_record?
            clock_in_day.update_attributes!(
              creator: staff_member_from_token
            )
          end

          status = ClockInStatus.new(
            clock_in_day: clock_in_day
          )

          status.transition_to!(
            state: to_state,
            at: at,
            requester: staff_member_from_token,
            nested: true
          )
        end
      end

      def staff_member_from_params
        @staff_member_from_params ||= StaffMember.find(params[:staff_member_id])
      end

      def date_from_params
        @date ||= Date.parse(params.fetch(:date))
      end
    end
  end
end
