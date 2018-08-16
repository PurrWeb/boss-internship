class HoursOverviewController < ApplicationController
  before_action :set_new_layout

  def show
    authorize! :view, :payroll_reports

    staff_member = StaffMember.find(params[:staff_member_id])
    date = date_from_params


    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!

    staff_clock_in_days = ClockInDay.where(
      staff_member: staff_member,
      date: date
    )

    staff_venues = if current_user.has_all_venue_access?
      Venue.all
    else
      current_user.venues
    end

    clock_in_notes = ClockInNote.
      joins(:clock_in_day).
      merge(staff_clock_in_days)

    staff_clock_in_days = staff_clock_in_days.
      includes([:venue, :staff_member, :hours_acceptance_periods])

    hours_confirmation_page_data = HoursConfirmationPageDataQuery.new(staff_clock_in_days, staff_venues).query

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
      merge(staff_clock_in_days).
      includes(:clock_in_events)

    clock_in_breaks = ClockInBreak.
      joins(:clock_in_period).
      merge(clock_in_periods).
      includes(:clock_in_period)

    clock_in_events = ClockInEvent.
      joins(:clock_in_period).
      merge(clock_in_periods).
      includes(:clock_in_period).
      preload(:creator)

    hours_acceptance_periods = HoursAcceptancePeriod.
      enabled.
      joins(:clock_in_day).
      merge(staff_clock_in_days).
      includes(:accepted_by, :finance_report)

    hours_acceptance_breaks = HoursAcceptanceBreak.
      enabled.
      joins(:hours_acceptance_period).
      merge(hours_acceptance_periods)

    staff_types = StaffType.all

    ability = UserAbility.new(current_user);
    user_periods_permissions = hours_acceptance_periods.map do |period|
      {
        id: period.id,
        permitted: ability.can?(:update, period)
      }
    end

    render(
      locals: {
        access_token: access_token,
        clock_in_breaks: clock_in_breaks,
        clock_in_notes: clock_in_notes,
        clock_in_events: clock_in_events,
        clock_in_periods: clock_in_periods,
        hours_acceptance_periods: hours_acceptance_periods,
        hours_acceptance_breaks: hours_acceptance_breaks,
        rotas: rotas,
        rota_shifts: rota_shifts,
        staff_member: staff_member,
        staff_types: staff_types,
        date: date,
        user_periods_permissions: user_periods_permissions,
      }.merge(hours_confirmation_page_data)
    )
  end

  private
  def date_from_params
    UIRotaDate.parse(params.fetch(:id))
  end
end
