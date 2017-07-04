class QuestionnaireResponseLogic
  def initialize(questionnaire_response:)
    @questionnaire_response = questionnaire_response
    @questionnaire = questionnaire_response.questionnaire
  end
  attr_reader :questionnaire_response, :questionnaire

  def result
    result = :fail
    if questionnaire.questionnaire_categories.all? { |category|
      QuestoinnaireCategoryLogic.new(questionnaire_category: category).pass?
    }
      result = :pass
    end
    result
  end

  def pass?
    result == :pass
  end
end
