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
        transition_state(to_state: :clocked_out)
        render nothing: true, status: :ok
      end

      def add_note
        staff_member = staff_member_from_params
        venue = venue_from_api_key
        date = date_from_params
        note = params.fetch(:note)

        authorize! :add_note, staff_member

        ClockInNote.create!(
          creator: staff_member_from_token,
          staff_member: staff_member,
          venue: venue,
          date: date,
          note: note,
          enabled: true
        )

        render nothing: true, status: :ok
      end

      private
      def transition_state(to_state:)
        staff_member = staff_member_from_params
        venue = venue_from_api_key
        date = date_from_params
        at = Time.current

        authorize!(:perform_clocking_action, staff_member)

        status = ClockInStatus.new(
          date: date,
          venue: venue,
          staff_member: staff_member
        )

        status.transition_to!(
          state: to_state,
          at: at,
          requester: staff_member_from_token,
        )
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
