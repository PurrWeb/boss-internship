class Api::V1::QuestionnaireAnswerSerializer < ActiveModel::Serializer
  attributes :id, :questionnaire_question_id, :questionnaire_response_id, :value, :passed, :note

  def passed
    if object.questionnaire_question.is_a?(BinaryQuestion)
      object.pass_value?
    else
      true
    end
  end
end
