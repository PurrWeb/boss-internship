class Api::V1::QuestionnaireAnswerSerializer < ActiveModel::Serializer
  attributes :id, :questionnaire_question_id, :questionnaire_response_id, :value, :passed, :note

  has_many :uploads, serializer: UploadSerializer

  def passed
    if ['BinaryQuestion', 'RequiredQuestion'].include?(object.questionnaire_question.type)
      object.pass_value?
    else
      nil
    end
  end
end
