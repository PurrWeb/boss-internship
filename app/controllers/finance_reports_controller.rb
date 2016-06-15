class FinanceReportsController < ApplicationController
  def index
    authorize! :manage, :admin

    venue = Venue.first
    week = RotaWeek.new(Time.current)

    staff_members_data = GenerateFinanceReportData.new(
      venue: venue,
      week: week
    ).call

    render locals: {
      week: week,
      venue: venue,
      staff_members_data: staff_members_data
    }
  end
end
