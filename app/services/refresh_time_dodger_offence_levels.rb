class RefreshTimeDodgerOffenceLevels
  DODGES_FIRST_LEVEL_THRESHOLD = 5
  DODGES_OTHER_LEVELS_THRESHOLD = 3

  def initialize(monday_tax_year:)
    @monday_tax_year = monday_tax_year
  end

  def call
    time_dodger_offence = InRangeQuery.new(
      relation: TimeDodgerOffence.hard_dodgers,
      start_value: monday_tax_year.start_date,
      end_value: monday_tax_year.end_date,
      start_column_name: "week_start",
      end_column_name: "week_start",
    ).all

    ActiveRecord::Base.transaction do
      time_dodger_offence.group_by(&:staff_member_id).each_pair do |id, dodges|
        count = dodges.count
        offence_level = 0
        if count >= DODGES_FIRST_LEVEL_THRESHOLD
          offence_level = 1 + ((count - DODGES_FIRST_LEVEL_THRESHOLD) / DODGES_OTHER_LEVELS_THRESHOLD)
        end
        time_dodger_offence_level = TimeDodgerOffenceLevel.find_or_initialize_by(
          tax_year_start: monday_tax_year.start_date,
          staff_member_id: id,
        )

        time_dodger_offence_level.update!(
          offence_level: offence_level,
          review_level: time_dodger_offence_level.time_dodger_review_actions.sum(:review_level),
        )
      end
    end
  end

  private

  attr_reader :monday_tax_year
end
