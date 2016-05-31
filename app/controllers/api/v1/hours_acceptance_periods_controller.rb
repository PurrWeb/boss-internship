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

        hours_acceptance_period = nil
        result = false
        breaks = nil

        ActiveRecord::Base.transaction do
          clock_in_day = ClockInDay.find_or_initialize_by(
            venue: venue,
            date: date,
            staff_member: staff_member
          )

          if clock_in_day.new_record?
            clock_in_day.update_attributes!(creator: requester)
          end

          hours_acceptance_period = HoursAcceptancePeriod.new(
            clock_in_day: clock_in_day,
            creator: requester,
            starts_at: params.fetch(:start_time),
            ends_at: params.fetch(:end_time),
            status: params.fetch(:status),
            hours_acceptance_reason: HoursAcceptanceReason.find(params.fetch(:hours_acceptance_reason_id)),
            reason_note: params[:reason_note]
          )

          breaks = new_breaks_from_params
          breaks.each do |_break|
            result = _break.update_attributes(
              hours_acceptance_period: hours_acceptance_period
            )
            hours_acceptance_period.hours_acceptance_breaks << _break
          end

          result = hours_acceptance_period.save

          raise ActiveRecord::Rollback unless result
        end

        if result
          render locals: {
            hours_acceptance_period: hours_acceptance_period,
            hours_acceptance_breaks: breaks
          }
        else
          render(
            'errors',
            locals: {
              hours_acceptance_period: hours_acceptance_period,
              hours_acceptance_breaks: breaks
            },
            status: :unprocessable_entity
          )
        end
      end

      def update
        hours_acceptance_period = hours_acceptance_period_from_params

        authorize! :update, hours_acceptance_period

        result = UpdateHoursAcceptancePeriod.new(
          hours_acceptance_period: hours_acceptance_period,
          starts_at: params.fetch(:starts_at),
          ends_at: params.fetch(:ends_at),
          breaks_data: params[:breaks] || [],
          status: params.fetch(:status),
          hours_acceptance_reason: HoursAcceptanceReason.find(params.fetch(:hours_acceptance_reason_id)),
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

      def destroy
        hours_acceptance_period = hours_acceptance_period_from_params

        hours_acceptance_period.update_attributes!(
          status: 'deleted'
        )

        authorize! :update, hours_acceptance_period

        render json: {}, status: :ok
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

        clock_in_day = ClockInDay.find_by!(
          venue: venue,
          date: date,
          staff_member: staff_member
        )

        status = ClockInStatus.new(
          clock_in_day: clock_in_day
        )

        status.transition_to!(
          state: :clocked_out,
          at: at,
          requester: current_user
        )

        hours_acceptance_period = HoursAcceptancePeriod.where(
          clock_in_day: clock_in_day
        ).last

        render locals: {
          clock_in_day: clock_in_day,
          hours_acceptance_period: hours_acceptance_period
        }
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
        params.fetch(:breaks).map do |break_data|
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
