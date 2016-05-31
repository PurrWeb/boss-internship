class HoursConfirmationController < ApplicationController
  def index
    if venue_from_params.present? && date_from_params.present?
      venue = venue_from_params
      date = date_from_params

      clock_in_days = ClockInDay.where(
        venue: venue,
        date: date
      )

      staff_members = StaffMember.joins(:clock_in_days).merge(clock_in_days)

      staff_types = StaffType.all

      clock_in_periods = ClockInPeriod.
        joins(:clock_in_day).
        merge(clock_in_days)

      clock_in_breaks = ClockInBreak.
        joins(:clock_in_period).
        merge(clock_in_periods)

      hours_acceptance_reasons = HoursAcceptanceReason.all

      clock_in_events = ClockInEvent.
        joins(:clock_in_period).
        merge(clock_in_periods)

      hours_acceptance_periods = HoursAcceptancePeriod.
        enabled.
        joins(:clock_in_day).
        merge(clock_in_days)

      hours_acceptance_breaks = HoursAcceptanceBreak.
        enabled.
        joins(:hours_acceptance_period).
        merge(hours_acceptance_periods)

      access_token = current_user.current_access_token || AccessToken.create_web!(user: current_user)

      venues = [venue]

      rota = Rota.where(
        venue: venue,
        date: date
      )

      rota_shifts = RotaShift.
        joins(:rota).
        merge(rota).
        joins(:staff_member).
        merge(staff_members)

      clock_in_statuses = clock_in_days.map do |clock_in_day|
        ClockInStatus.new(clock_in_day: clock_in_day)
      end

      clock_in_notes = ClockInNote.
        joins(:clock_in_day).
        merge(clock_in_days)

      render locals: {
        access_token: access_token,
        staff_members: staff_members,
        staff_types: staff_types,
        clock_in_days: clock_in_days,
        clock_in_statuses: clock_in_statuses,
        hours_acceptance_periods: hours_acceptance_periods,
        hours_acceptance_breaks: hours_acceptance_breaks,
        hours_acceptance_reasons: hours_acceptance_reasons,
        clock_in_notes: clock_in_notes,
        clock_in_periods: clock_in_periods,
        clock_in_breaks:  clock_in_breaks,
        clock_in_events: clock_in_events,
        rotas: Array(rota),
        rota_shifts: rota_shifts,
        venues: venues,
        venue: venue,
        date: date
      }
    else
      redirect_to hours_confirmation_index_path(index_redirect_params)
    end
  end

  def current
    if venue_from_params.present?
      venue = venue_from_params

      clock_in_days = ClockInDaysPendingConfirmationQuery.new(
        venue: venue
      ).all

      staff_members = StaffMember.joins(:clock_in_days).merge(clock_in_days)

      staff_types = StaffType.all

      clock_in_periods = ClockInPeriod.
        joins(:clock_in_day).
        merge(clock_in_days)

      clock_in_breaks = ClockInBreak.
        joins(:clock_in_period).
        merge(clock_in_periods)

      hours_acceptance_reasons = HoursAcceptanceReason.all

      clock_in_events = ClockInEvent.
        joins(:clock_in_period).
        merge(clock_in_periods)

      hours_acceptance_periods = HoursAcceptancePeriod.
        enabled.
        joins(:clock_in_day).
        merge(clock_in_days)

      hours_acceptance_breaks = HoursAcceptanceBreak.
        enabled.
        joins(:hours_acceptance_period).
        merge(hours_acceptance_periods)

      access_token = current_user.current_access_token || AccessToken.create_web!(user: current_user)

      venues = [venue]

      rota = Rota.where(
        venue: venue,
        date: clock_in_days.pluck(:date).uniq
      )

      rota_shifts = RotaShift.
        joins(:rota).
        merge(rota).
        joins(:staff_member).
        merge(staff_members)

      clock_in_statuses = clock_in_days.map do |clock_in_day|
        ClockInStatus.new(clock_in_day: clock_in_day)
      end

      clock_in_notes = ClockInNote.
        joins(:clock_in_day).
        merge(clock_in_days)

      render locals: {
        access_token: access_token,
        staff_members: staff_members,
        staff_types: staff_types,
        clock_in_days: clock_in_days,
        clock_in_statuses: clock_in_statuses,
        hours_acceptance_periods: hours_acceptance_periods,
        hours_acceptance_breaks: hours_acceptance_breaks,
        hours_acceptance_reasons: hours_acceptance_reasons,
        clock_in_notes: clock_in_notes,
        clock_in_periods: clock_in_periods,
        clock_in_breaks:  clock_in_breaks,
        clock_in_events: clock_in_events,
        rotas: Array(rota),
        rota_shifts: rota_shifts,
        venues: venues,
        venue: venue
      }
    else
      redirect_to current_hours_confirmation_index_path(current_redirect_params)
    end
  end

  private
  def date_from_params
    if params[:date].present?
      UIRotaDate.parse(params[:date])
    end
  end

  def venue_from_params
    Venue.find_by(id: params[:venue_id])
  end

  def index_redirect_params
    {
      date: date_from_params || UIRotaDate.format(Time.current.to_date),
      venue_id: venue_from_params.andand.id || current_user.default_venue.id
    }
  end

  def current_redirect_params
    {
      venue_id: current_user.default_venue.id
    }
  end
end
