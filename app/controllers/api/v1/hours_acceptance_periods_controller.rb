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

        if !staff_member.clocked_out_for_venue?(date: date, venue: venue)
          render(json: {}, status: :access_denied)
        else
          result = CreateHoursAcceptancePeriod.new(
            requester: requester,
            staff_member: staff_member,
            venue: venue,
            date: date,
            starts_at: params.fetch(:startsAt),
            ends_at: params.fetch(:endsAt),
            status: params.fetch(:status),
            reason_note: params[:reasonNote],
            breaks: new_breaks_from_params
          ).call

          if result.success?
            render json: {
              hoursAcceptancePeriod: Api::V1::HoursConfirmation::HoursAcceptancePeriodSerializer.new(result.hours_acceptance_period),
              breaks: ActiveModel::Serializer::CollectionSerializer.new(
                result.breaks,
                serializer: Api::V1::HoursConfirmation::HoursAcceptanceBreakSerializer,
              )
            }, status: :ok
          else
            render json: {errors: result.api_errors.errors}, status: 422
          end
        end
      end

      def update
        hours_acceptance_period = hours_acceptance_period_from_params

        authorize! :update, hours_acceptance_period

        if !hours_acceptance_period.staff_member.clocked_out_for_venue?(
             venue: hours_acceptance_period.venue,
             date: hours_acceptance_period.date
           )
          render(json: {}, status: :access_denied)
        else
          result = UpdateHoursAcceptancePeriod.new(
            hours_acceptance_period: hours_acceptance_period,
            starts_at: params.fetch(:startsAt),
            ends_at: params.fetch(:endsAt),
            breaks_data: params[:breaks] || [],
            status: params.fetch(:status),
            reason_note: params[:reasonNote],
            requester: current_user
          ).call

          if result.success?
            render json: {
              hoursAcceptancePeriod: Api::V1::HoursConfirmation::HoursAcceptancePeriodSerializer.new(result.hours_acceptance_period),
              breaks: ActiveModel::Serializer::CollectionSerializer.new(
                result.hours_acceptance_breaks,
                serializer: Api::V1::HoursConfirmation::HoursAcceptanceBreakSerializer,
              )
            }, status: :ok
          else
            render json: {errors: result.api_errors.errors}, status: 422
          end
        end
      end

      def destroy
        hours_acceptance_period = hours_acceptance_period_from_params
        authorize! :update, hours_acceptance_period

        if !hours_acceptance_period.staff_member.clocked_out_for_venue?(
             venue: hours_acceptance_period.venue,
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

          render json: {
            clockInPeriod: Api::V1::HoursConfirmation::ClockInPeriodSerializer.new(clock_in_period),
            hoursAcceptancePeriod: Api::V1::HoursConfirmation::HoursAcceptancePeriodSerializer.new(hours_acceptance_period),
            hoursAcceptanceBreaks: ActiveModel::Serializer::CollectionSerializer.new(
              hours_acceptance_period.hours_acceptance_breaks.enabled,
              serializer: Api::V1::HoursConfirmation::HoursAcceptanceBreakSerializer,
            ),
            clockInEvent: Api::V1::HoursConfirmation::ClockInEventSerializer.new(clock_in_period.clock_in_events.last),
            clockInBreaks: ActiveModel::Serializer::CollectionSerializer.new(
              clock_in_period.clock_in_breaks,
              serializer: Api::V1::HoursConfirmation::ClockInBreakSerializer,
            )
          }
        else
          render json: { errors: result.errors }, status: 422
        end
      end

      private
      def hours_acceptance_period_from_params
        HoursAcceptancePeriod.find(params.fetch(:id))
      end

      def venue_from_params
        Venue.find(params[:venueId])
      end

      def date_from_params
        Date.parse(params.fetch(:date))
      end

      def staff_member_from_params
        StaffMember.find(params[:staffMember])
      end

      def new_breaks_from_params
        Array(params.fetch(:breaks)).map do |break_data|
          initialize_break(break_data)
        end
      end

      def initialize_break(data)
        HoursAcceptanceBreak.new(
          starts_at: data.fetch(:startsAt),
          ends_at: data.fetch(:endsAt)
        )
      end
    end
  end
end
