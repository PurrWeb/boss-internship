class HoursOverviewController < ApplicationController
  def show
    authorize! :view, :weekly_reports

    staff_member = StaffMember.find(params[:staff_member_id])
    date = date_from_params


    access_token = current_user.current_access_token || AccessToken.create_web!(user: current_user)

    clock_in_days = ClockInDay.where(
      staff_member: staff_member,
      date: date
    )

    venues = if current_user.has_all_venue_access?
      Venue.all
    else
      current_user.venues
    end

    clock_in_notes = ClockInNote.
      joins(:clock_in_day).
      merge(clock_in_days)

    clock_in_days = clock_in_days.
      includes([:venue, :staff_member])

    rotas = Rota.
      where(
        date: date
      ).
      includes(:venue)

    rota_shifts = RotaShift.
      joins(:rota).
      merge(rotas).
      where(staff_member: staff_member).
      includes([:rota, :staff_member])

    clock_in_periods = ClockInPeriod.
      joins(:clock_in_day).
      merge(clock_in_days)

    clock_in_breaks = ClockInBreak.
      joins(:clock_in_period).
      merge(clock_in_periods).
      includes(:clock_in_period)

    clock_in_events = ClockInEvent.
      joins(:clock_in_period).
      merge(clock_in_periods).
      includes(:clock_in_period)

    hours_acceptance_periods = HoursAcceptancePeriod.
      enabled.
      joins(:clock_in_day).
      merge(clock_in_days)

    hours_acceptance_breaks = HoursAcceptanceBreak.
      enabled.
      joins(:hours_acceptance_period).
      merge(hours_acceptance_periods)

    staff_types = StaffType.all

    render(
      locals: {
        access_token: access_token,
        clock_in_days: clock_in_days,
        clock_in_breaks: clock_in_breaks,
        clock_in_notes: clock_in_notes,
        clock_in_events: clock_in_events,
        clock_in_periods: clock_in_periods,
        hours_acceptance_periods: hours_acceptance_periods,
        hours_acceptance_breaks: hours_acceptance_breaks,
        venues: venues,
        rotas: rotas,
        rota_shifts: rota_shifts,
        staff_member: staff_member,
        staff_types: staff_types,
        date: date
      }
    )
  end

  private
  def date_from_params
    UIRotaDate.parse(params.fetch(:id))
  end
end
