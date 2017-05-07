class Api::V1::QuestionnaireCategoryScoreSerializer < ActiveModel::Serializer
  attributes :questionnaire_category_id, :passed, :threshold, :category_score,
    :total_score, :required_question_passed

  def questionnaire_category_id
    object.id
  end

  def passed
    service.category_passed?(object)
  end

  def required_question_passed
    service.required_questions_passed?(object)
  end

  def threshold
    service.category_threshold(object)
  end

  def category_score
    service.category_score(object)
  end

  def total_score
    service.total_category_score(object)
  end

  private

  def service
    @service ||= QuestionnaireCategoryForm.new(
      questionnaire: scope
    )
  end
end
