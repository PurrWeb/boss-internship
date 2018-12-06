class CreateTimeDodgerReviewAction
  class Result < Struct.new(:success, :review_action)
    def success?
      success
    end
  end

  def initialize(requester:)
    @requester = requester
  end

  def call(params)
    success = false
    review_action = nil

    staff_member_id = params.fetch(:staff_member_id)
    note = params.fetch(:note)
    week_start = params.fetch(:week_start)
    monday_tax_year = MondayTaxYear.new(week_start)

    related_offence_level = TimeDodgerOffenceLevel.find_by(tax_year_start: monday_tax_year.start_date, staff_member_id: staff_member_id)
    ActiveRecord::Base.transaction do
      current_offence_level = related_offence_level.offence_level
      current_review_level = related_offence_level.review_level
      review_level_to_add = current_offence_level - current_review_level

      review_action = related_offence_level.time_dodger_review_actions.build({
        creator_user: requester,
        note: note,
        review_level: review_level_to_add,
      })

      success = review_action.save
      success = if success
                 related_offence_level.update(review_level: current_offence_level)
               end
      raise ActiveRecord::Rollback unless success
    end

    Result.new(success, review_action)
  end

  private

  attr_reader :requester, :ability
end
