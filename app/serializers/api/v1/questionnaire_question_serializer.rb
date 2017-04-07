class Api::V1::QuestionnaireQuestionSerializer < ActiveModel::Serializer
  attributes :id, :text, :questionnaire_category_id, :start_scale, :end_scale, :type

  def start_scale
    1
  end

  def end_scale
    5
  end
end
