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

      private
      def transition_state(to_state:)
        staff_member = StaffMember.find(params[:staff_member_id])
        venue = Venue.find(params.fetch(:venue_id))
        date = UIRotaDate.parse(params.fetch(:date))
        at = Time.zone.parse(params.fetch(:at))

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
    end
  end
end
