class Api::V1::QuestionnaireQuestionSerializer < ActiveModel::Serializer
  attributes :id, :text, :questionnaire_category_id, :start_value, :end_value, :type, :possible_values, :pass_values, :fail_values

  def possible_values
    return [] if object.possible_values.blank?

    object.possible_values.split(',').map(&:strip)
  end
end
