class QuestionnaireQuestion < ActiveRecord::Base
  # Associations
  belongs_to :questionnaire_category
  belongs_to :questionnaire_area
  belongs_to :questionnaire
  has_many :questionnaire_answers

  # Validations
  validates :text, presence: true
end
