class QuestionnaireResponseLogic
  def initialize(questionnaire_response:)
    @response = questionnaire_response
    @questionnaire = response.questionnaire
  end
  attr_reader :response, :questionnaire

  def result
    result = :fail
    if questionnaire.questionnaire_categories.includes(:questionnaires).all? { |category|
      QuestionnaireCategoryLogic.new(
        questionnaire: questionnaire,
        questionnaire_category: category
      ).pass?(response: response)
    }
      result = :pass
    end
    result
  end

  def pass?
    result == :pass
  end
end
