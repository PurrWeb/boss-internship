class QuestionnaireArea < ActiveRecord::Base
  # Associations
  has_and_belongs_to_many :questionnaires
  has_many :questionnaire_questions
end
