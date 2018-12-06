class CreateTimeDodgerReviewActionApiService
  class Result < Struct.new(:success, :review_action, :api_errors)
    def success?
      success
    end
  end

  def initialize(requester:)
    @requester = requester
  end

  def call(params)
    staff_member_id = params.fetch(:staffMemberId)
    note = params.fetch(:note)
    week_start = UIRotaDate.parse(params.fetch(:weekStart))

    result = CreateTimeDodgerReviewAction.new(requester: requester).call({
      staff_member_id: staff_member_id,
      note: note,
      week_start: week_start,
    })

    api_errors = nil
    if !result.success?
      api_errors = result.review_action.errors
    end

    Result.new(result.success?, result.review_action, api_errors)
  end

  private

  attr_reader :requester, :ability
end
