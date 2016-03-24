require 'csv'

class HolidayReportCSV
  def initialize(holidays)
    @holidays = holidays
    @staff_members_holidays = _staff_members_holidays(holidays)
  end

  def to_s
    CSV.generate do |csv|
      csv << [
        'Venue Name',
        'Venue ID',
        'Staff Member Name',
        'Staff Member ID',
        'Paid Holiday Days',
        'Unpaid Holiday Days'
      ]

      staff_members_holidays.each do |id, data|
        staff_member = data.fetch(:staff_member)
        venue = staff_member.venue
        paid_holiday_days = data.fetch(:paid_holiday_days)
        unpaid_holiday_days = data.fetch(:unpaid_holiday_days)

        csv << [
          venue.name,
          venue.id,
          staff_member.full_name.titlecase,
          staff_member.id,
          paid_holiday_days,
          unpaid_holiday_days
        ]
      end
    end
  end

  private
  def _staff_members_holidays(holidays)
    result = {}
    holidays.all.each do |holiday|
      result[holiday.staff_member.id] ||= {}
      result[holiday.staff_member.id][:holidays] ||= []
      result[holiday.staff_member.id][:paid_holiday_days] ||= 0
      result[holiday.staff_member.id][:unpaid_holiday_days] ||= 0

      result[holiday.staff_member.id][:staff_member] = holiday.staff_member
      result[holiday.staff_member.id][:holidays] << holiday
      if holiday.paid?
        result[holiday.staff_member.id][:paid_holiday_days] += holiday.days
      else
        result[holiday.staff_member.id][:unpaid_holiday_days] += holiday.days
      end
    end
    result
  end

  attr_reader :holidays, :staff_members_holidays
end
