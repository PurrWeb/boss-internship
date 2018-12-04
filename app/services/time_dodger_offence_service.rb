class TimeDodgerOffenceService
  def initialize(start_date:, end_date:)
    @start_date = RotaWeek.new(start_date).start_date
    @end_date = RotaWeek.new(end_date).end_date
  end

  def call
    relation = StaffMember.enabled.regular.on_weekly_pay_rate.with_master_venue

    ActiveRecord::Base.transaction do
      (start_date..end_date).step(7).each do |day|
        week = RotaWeek.new(day)
        TimeDodgersDataService.new(
          start_date: week.start_date,
          end_date: week.end_date,
          relation: relation,
        ).call do |staff_member_id, dodger_data|
          time_dodger_offence = TimeDodgerOffence.find_or_initialize_by(
            week_start: week.start_date,
            staff_member_id: staff_member_id,
          )
          time_dodger_offence.update!(
            accepted_hours: dodger_data[:accepted_hours],
            paid_holidays: dodger_data[:paid_holidays],
            owed_hours: dodger_data[:owed_hours],
            accepted_breaks: dodger_data[:accepted_breaks],
            minutes: dodger_data[:accepted_hours] + dodger_data[:paid_holidays] + dodger_data[:owed_hours],
          )
        end
      end
    end
  end

  private

  attr_reader :start_date, :end_date
end
