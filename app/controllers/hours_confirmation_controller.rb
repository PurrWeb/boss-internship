class HoursConfirmationController < ApplicationController
  before_action :set_venue
  before_action :set_date, only: [:index]
  before_action :set_new_layout

  attr_reader :venue, :date

  def index
    if venue.present? && date.present?
      authorize! :view, HoursConfirmationPage.new(venue: venue)

      clock_in_days = ClockInDay.where(
        venue: venue,
        date: date
      ).includes([:staff_member, :venue, :clock_in_notes])

      staff_members = StaffMember.where(
        id: clock_in_days.map(&:staff_member_id).uniq
      ).includes([:master_venue, :staff_type, :name, :work_venues])

      staff_types = StaffType.all

      clock_in_periods = ClockInPeriod.where(
        clock_in_day: clock_in_days
      ).includes([:clock_in_day, :clock_in_events, :clock_in_breaks])

      clock_in_breaks = ClockInBreak.where(
        clock_in_period: clock_in_periods
      ).includes(:clock_in_period)

      clock_in_events = ClockInEvent.where(
        clock_in_period: clock_in_periods
      ).includes([:clock_in_period, :creator])

      hours_acceptance_periods = HoursAcceptancePeriod.enabled.where(
        clock_in_day: clock_in_days
      ).includes([:finance_report, :hours_acceptance_breaks_enabled, accepted_by: [:name], clock_in_day: [:venue]])

      ability = UserAbility.new(current_user);
      user_periods_permissions = hours_acceptance_periods.map do |period|
        {
          id: period.id,
          permitted: ability.can?(:update, period)
        }
      end

      hours_acceptance_breaks = HoursAcceptanceBreak.enabled.where(
        hours_acceptance_period: hours_acceptance_periods
      ).includes(:hours_acceptance_period)

      access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!

      venues = if current_user.has_all_venue_access?
        Venue.all
      else
        current_user.venues
      end

      rota = Rota.where(
        venue: venue,
        date: date
      )

      rotas = Rota.where(
        date: clock_in_days.map(&:date).uniq,
        venue: venue
      ).includes(:venue)

      rota_shifts = RotaShift.
        enabled.
        where(
          rota: rota,
          staff_member: staff_members
        ).includes([:rota, :staff_member])

      clock_in_notes = ClockInNote.where(
        clock_in_day_id: clock_in_days
      ).includes(:clock_in_day)

      render locals: {
        access_token: access_token,
        staff_members: staff_members,
        staff_types: staff_types,
        clock_in_days: clock_in_days,
        hours_acceptance_periods: hours_acceptance_periods,
        hours_acceptance_breaks: hours_acceptance_breaks,
        clock_in_notes: clock_in_notes,
        clock_in_periods: clock_in_periods,
        clock_in_breaks:  clock_in_breaks,
        clock_in_events: clock_in_events,
        rotas: rotas,
        rota_shifts: rota_shifts,
        venues: venues,
        venue: venue,
        user_periods_permissions: user_periods_permissions,
        date: date
      }
    else
      if date.present?
        redirect_to hours_confirmation_index_path({date: UIRotaDate.format(date), venue_id: current_venue.id})
      else
        redirect_to current_hours_confirmation_index_path
      end
    end
  end

  def current
    if venue.present?
      authorize! :view, HoursConfirmationPage.new(venue: venue)

      clock_in_days = ClockInDaysPendingConfirmationQuery.new(
        venue: venue
      ).all

      staff_members = StaffMember.where(
        id: clock_in_days.map(&:staff_member_id).uniq
      ).includes([:master_venue, :staff_type, :name, :work_venues])

      staff_types = StaffType.all

      clock_in_periods = ClockInPeriod.where(
        clock_in_day: clock_in_days,
      ).includes(:clock_in_day, :clock_in_events, :clock_in_breaks, clock_in_day: [:staff_member, :venue])

      clock_in_breaks = ClockInBreak.where(
        clock_in_period: clock_in_periods
      ).includes(:clock_in_period)

      clock_in_events = ClockInEvent.where(
        clock_in_period: clock_in_periods
      ).includes([:clock_in_period, :creator])

      hours_acceptance_periods = HoursAcceptancePeriod.where(
        clock_in_day: clock_in_days,
        status: HoursAcceptancePeriod::STATES - [HoursAcceptancePeriod::DELETED_STATE]
      ).includes(:finance_report, :hours_acceptance_breaks_enabled, :accepted_by, clock_in_day: [:venue])

      ability = UserAbility.new(current_user);
      user_periods_permissions = hours_acceptance_periods.map do |period|
        {
          id: period.id,
          permitted: ability.can?(:update, period)
        }
      end

      hours_acceptance_breaks = HoursAcceptanceBreak.where(
        hours_acceptance_period: hours_acceptance_periods,
        disabled_at: nil
      ).includes(:hours_acceptance_period)

      access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
      venues = if current_user.has_all_venue_access?
        Venue.all
      else
        current_user.venues
      end

      rotas = Rota.where(
        date: clock_in_days.pluck(:date).uniq,
        venue: venue
      ).includes([:venue, :rota_status_transitions])

      rota = rotas.select { |r| r.venue_id == venue.id }
      rota_shifts = RotaShift.where(
        rota: rota,
        staff_member: staff_members
      ).includes([:rota, :staff_member])

      clock_in_notes = ClockInNote.where(
        clock_in_day: clock_in_days
      )

      clock_in_days = clock_in_days.includes(
        [
          :venue, :staff_member, :clock_in_notes,
          :hours_acceptance_periods, :clock_in_periods
        ]
      )

      render locals: {
        access_token: access_token,
        staff_members: staff_members,
        staff_types: staff_types,
        hours_acceptance_periods: hours_acceptance_periods,
        hours_acceptance_breaks: hours_acceptance_breaks,
        clock_in_notes: clock_in_notes,
        clock_in_periods: clock_in_periods,
        clock_in_breaks:  clock_in_breaks,
        clock_in_events: clock_in_events,
        rotas: rotas,
        rota_shifts: rota_shifts,
        venues: venues,
        user_periods_permissions: user_periods_permissions,
        venue: venue
      }
    else
      redirect_to current_hours_confirmation_index_path(current_redirect_params)
    end
  end

  private

  def set_venue
    @venue ||= Venue.find_by(id: params[:venue_id])
  end

  def set_date
    @date ||= params[:date].present? ? UIRotaDate.parse(params[:date]) : nil
  end

  def venue_from_params
    Venue.find_by(id: params[:venue_id])
  end

  def index_redirect_params
    {
      date: date || UIRotaDate.format(Time.current.to_date),
      venue_id: current_venue.id
    }
  end

  def current_redirect_params
    {
      venue_id: current_venue.id
    }
  end
end
