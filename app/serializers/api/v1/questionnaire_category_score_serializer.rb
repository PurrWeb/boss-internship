class Api::V1::QuestionnaireCategoryScoreSerializer < ActiveModel::Serializer
  attributes :questionnaire_category_id, :passed, :threshold, :category_score,
    :total_score, :required_question_passed

  def questionnaire_category_id
    object.id
  end

  def passed
    service.pass?(response: response)
  end

  def required_question_passed
    service.required_questions_passed?(response: response)
  end

  def threshold
    service.threshold_percentage
  end

  def category_score
    service.score(response: response)
  end

  def total_score
    service.posible_score
  end

  private
  def questionnaire
    @questionnaire ||= scope.fetch(:questionnaire)
  end

  def response
    @response ||= scope.fetch(:response)
  end

  def service
    @service ||= QuestionnaireCategoryLogic.new(
      questionnaire: scope.fetch(:questionnaire),
      questionnaire_category: object
    )
  end
end
