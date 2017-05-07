class Questionnaire < ActiveRecord::Base
  # Associations
  has_and_belongs_to_many :venues
  has_many :questionnaire_questions
  has_many :questionnaire_responses
  has_many :questionnaire_areas_questionnaires
  has_many :questionnaire_areas,
           through: :questionnaire_areas_questionnaires
  has_many :questionnaire_categories_questionnaires
  has_many :questionnaire_categories,
           through: :questionnaire_categories_questionnaires

  # Validations
  validates :name, presence: true
end
