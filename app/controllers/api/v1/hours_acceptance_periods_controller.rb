module Api
  module V1
    class HoursAcceptancePeriodsController < APIController
      before_filter :web_token_authenticate!

      def user_for_paper_trail
        current_user && current_user.whodunnit_data
      end

      def create
        requester = current_user
        venue = venue_from_params
        date = date_from_params
        staff_member = staff_member_from_params

        if !staff_member.clocked_out?(date: date)
          render(json: {}, status: :access_denied)
        else
          result = CreateHoursAcceptancePeriod.new(
            requester: requester,
            staff_member: staff_member,
            venue: venue,
            date: date,
            starts_at: params.fetch(:starts_at),
            ends_at: params.fetch(:ends_at),
            status: params.fetch(:status),
            reason_note: params[:reason_note],
            breaks: new_breaks_from_params
          ).call

          if result.success
            render locals: {
              hours_acceptance_period: result.hours_acceptance_period,
              hours_acceptance_breaks: result.breaks
            }
          else
            render(
              'errors',
              locals: {
                hours_acceptance_period: result.hours_acceptance_period,
                hours_acceptance_breaks: result.breaks
              },
              status: :unprocessable_entity
            )
          end
        end
      end

      def update
        hours_acceptance_period = hours_acceptance_period_from_params

        authorize! :update, hours_acceptance_period

        if !hours_acceptance_period.staff_member.clocked_out?(
             date:hours_acceptance_period.date
           )
          render(json: {}, status: :access_denied)
        else
          result = UpdateHoursAcceptancePeriod.new(
            hours_acceptance_period: hours_acceptance_period,
            starts_at: params.fetch(:starts_at),
            ends_at: params.fetch(:ends_at),
            breaks_data: params[:hours_acceptance_breaks] || [],
            status: params.fetch(:status),
            reason_note: params[:reason_note],
            requester: current_user
          ).call

          if result.success?
            render locals: {
              hours_acceptance_period: result.hours_acceptance_period,
              hours_acceptance_breaks: result.hours_acceptance_breaks
            }
          else
            render(
              'errors',
              locals: {
                hours_acceptance_period: result.hours_acceptance_period,
                hours_acceptance_breaks: result.hours_acceptance_breaks
              },
              status: :unprocessable_entity
            )
          end
        end
      end

      def destroy
        hours_acceptance_period = hours_acceptance_period_from_params
        authorize! :update, hours_acceptance_period

        if !hours_acceptance_period.staff_member.clocked_out?(
             date: hours_acceptance_period.date
           )
          render(json: {}, status: :access_denied)
        else
          result = DeleteHoursAcceptancePeriod.new(
            requester: current_user,
            hours_acceptance_period: hours_acceptance_period
          ).call

          if result.success?
            render json: {}, status: :ok
          else
            render json: {}, status: :unprocessable_entity
          end
        end
      end

      def clock_out
        staff_member = staff_member_from_params

        authorize!(:perform_clocking_action, staff_member)

        date = date_from_params
        venue = venue_from_params

        at = Time.current
        if !RotaShiftDate.new(date).contains_time?(at)
          at = RotaShiftDate.new(date).end_time
        end

        result = ChangeClockInStatus.new(
          venue: venue,
          date: date,
          staff_member: staff_member,
          state: :clocked_out,
          at: at,
          requester: current_user
        ).call

        if result.success?
          clock_in_day = result.clock_in_day

          hours_acceptance_period = HoursAcceptancePeriod.where(
            clock_in_day: clock_in_day
          ).last

          clock_in_period = ClockInPeriod.where(
            clock_in_day: clock_in_day
          ).last

          render locals: {
            clock_in_day: clock_in_day,
            clock_in_period: clock_in_period,
            hours_acceptance_period: hours_acceptance_period
          }
        else
          render json: result.errors, status: 500
        end
      end

      private
      def hours_acceptance_period_from_params
        HoursAcceptancePeriod.find(params.fetch(:id))
      end

      def venue_from_params
        Venue.find(params[:venue_id])
      end

      def date_from_params
        Date.parse(params.fetch(:date))
      end

      def staff_member_from_params
        StaffMember.find(params[:staff_member_id])
      end

      def new_breaks_from_params
        Array(params[:hours_acceptance_breaks]).map do |break_data|
          initialize_break(break_data)
        end
      end

      def initialize_break(data)
        HoursAcceptanceBreak.new(
          starts_at: data.fetch(:starts_at),
          ends_at: data.fetch(:ends_at)
        )
      end
    end
  end
end
