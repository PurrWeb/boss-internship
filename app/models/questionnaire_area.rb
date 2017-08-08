class QuestionnaireArea < ActiveRecord::Base
  # Associations
  has_many :questionnaire_questions
  has_many :questionnaire_areas_questionnaires
  has_many :questionnaires, through: :questionnaire_areas_questionnaires
end
