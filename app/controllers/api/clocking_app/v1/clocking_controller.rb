module Api
  module ClockingApp
    module V1
      class ClockingController < ClockingAppController
        def clock_in
          result = transition_state(to_state: :clocked_in)

          if result.success?
            render json: {
              clockInEvent: Api::ClockingApp::V1::ClockInEventSerializer.new(result.clock_in_day.last_clock_in_event)
            }
          else
            render json: { errors: {} }, status: 422
          end
        end

        def clock_out
          result = transition_state(to_state: :clocked_out)

          if result.success?
            render json: {
              clockInEvent: Api::ClockingApp::V1::ClockInEventSerializer.new(result.clock_in_day.last_clock_in_event)
            }
          else
            render json: { errors: {} }, status: 422
          end
        end

        def start_break
          result = transition_state(to_state: :on_break)

          if result.success?
            render json: {
              clockInEvent: Api::ClockingApp::V1::ClockInEventSerializer.new(result.clock_in_day.last_clock_in_event)
            }
          else
            render json: { errors: {} }, status: 422
          end
        end

        def end_break
          result = transition_state(to_state: :clocked_in)

          if result.success?
            render json: {
              clockInEvent: Api::ClockingApp::V1::ClockInEventSerializer.new(result.clock_in_day.last_clock_in_event)
            }
          else
            render json: { errors: {} }, status: 422
          end
        end

        private
        def transition_state(to_state:)
          staff_member = staff_member_from_params
          venue = venue_from_api_key
          at = Time.current
          date = RotaShiftDate.to_rota_date(at)

          authorize!(:perform_clocking_action, staff_member)

          result = ChangeClockInStatus.new(
            date: date,
            venue: venue,
            staff_member: staff_member,
            state: to_state,
            at: at,
            requester: current_staff_member
          ).call

          if result.success?
            venue_api_key = venue_from_api_key.api_key.key
            clocking_app_frontend_updates = ClockingAppFrontendUpdates.new(venue_api_key: venue_api_key)
            clocking_app_frontend_updates.clocking_events_updates(clocking_event: result.clock_in_day.last_clock_in_event)
            clocking_app_frontend_updates.dispatch
          end

          result
        end

        def staff_member_from_params
          StaffMember.enabled.find_by(id: params.fetch(:staffMemberId))
        end

        def date_from_params
          Date.parse(params.fetch(:date))
        end
      end
    end
  end
end
