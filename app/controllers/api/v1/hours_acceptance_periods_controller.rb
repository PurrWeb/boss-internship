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
            status: params.fetch(:status)
          )

          new_breaks_from_params.each do |_break|
            result = _break.update_attributes(
              hours_acceptance_period: hours_acceptance_period
            )
            hours_acceptance_period.hours_acceptance_breaks << _break
          end

          result = hours_acceptance_period.save
        end

        if result
          render locals: { hours_acceptance_period: hours_acceptance_period }
        else
          render(
            'errors',
            locals: { hours_acceptance_period: hours_acceptance_period },
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
          requester: current_user
        ).call

        if result.success?
          render locals: { hours_acceptance_period: result.hours_acceptance_period }
        else
          render(
            'errors',
            locals: { hours_acceptance_period: result.hours_acceptance_period },
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
