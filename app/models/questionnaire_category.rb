class QuestionnaireCategory < ActiveRecord::Base
  # Associations
  has_many :questionnaire_questions
  has_many :questionnaire_categories_questionnaires
  has_many :questionnaires, through: :questionnaire_categories_questionnaires
end
