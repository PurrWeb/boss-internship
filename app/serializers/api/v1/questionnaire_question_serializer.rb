class Api::V1::QuestionnaireQuestionSerializer < ActiveModel::Serializer
  attributes :id, :text, :questionnaire_category_id
end
