module Api
  module V1
    class ClockingController < APIController
      before_filter :api_token_athenticate!

      def clock_in
        result = transition_state(to_state: :clocked_in)

        if result.success?
          render locals: { clock_in_day: result.clock_in_day }
        else
          render 'errors', status: :unprocessable_entity, locals: { errors: result.errors, clock_in_day: result.clock_in_day }
        end
      end

      def clock_out
        result = transition_state(to_state: :clocked_out)

        if result.success?
          render locals: { clock_in_day: result.clock_in_day }
        else
          render 'errors', status: :unprocessable_entity, locals: { errors: result.errors, clock_in_day: result.clock_in_day }
        end
      end

      def start_break
        result = transition_state(to_state: :on_break)

        if result.success?
          render locals: { clock_in_day: result.clock_in_day }
        else
          render 'errors', status: :unprocessable_entity, locals: { errors: result.errors, clock_in_day: result.clock_in_day }
        end
      end

      def end_break
        result = transition_state(to_state: :clocked_in)

        if result.success?
          render locals: { clock_in_day: result.clock_in_day }
        else
          render 'errors', status: :unprocessable_entity, locals: { errors: result.errors, clock_in_day: result.clock_in_day }
        end
      end

      def add_note
        staff_member = staff_member_from_params
        venue = venue_from_api_key
        date = date_from_params
        note = params.fetch(:note)

        authorize! :add, :note

        clock_in_note = nil

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

          clock_in_note = ClockInNote.create!(
            creator: staff_member_from_token,
            clock_in_day: clock_in_day,
            note: note,
            enabled: true
          )
        end

        render locals: { clock_in_note: clock_in_note }
      end

      private
      def transition_state(to_state:)
        staff_member = staff_member_from_params
        venue = venue_from_api_key
        at = Time.current
        date = RotaShiftDate.to_rota_date(at)
        week = RotaWeek.new(date)

        authorize!(:perform_clocking_action, staff_member)

        result = ChangeClockInStatus.new(
          date: date,
          venue: venue,
          staff_member: staff_member,
          state: to_state,
          at: at,
          requester: staff_member_from_token
        ).call

        if result.success?
          if staff_member.can_have_finance_reports? && [:clocked_in, :clocked_out].include?(to_state)
            MarkFinanceReportRequiringUpdate.new(staff_member: staff_member, week: week).call
          end
          clocking_app_frontend_updates = ClockingAppFrontendUpdates.new(venue_api_key: venue.api_key.key)
          clocking_app_frontend_updates.clocking_events_updates(clocking_event: result.clock_in_day.last_clock_in_event)
          clocking_app_frontend_updates.dispatch
        end

        result
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
