class QuestionnaireQuestion < ActiveRecord::Base
  # Associations
  belongs_to :questionnaire_category

  # Validations
  validates :text, presence: true
end
