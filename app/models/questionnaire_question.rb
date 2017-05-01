class QuestionnaireQuestion < ActiveRecord::Base
  # Associations
  belongs_to :questionnaire_category
  belongs_to :questionnaire_area
  belongs_to :questionnaire
  has_many :questionnaire_answers, class_name: 'QuestionnaireAnswer', foreign_key: :question_id

  # Validations
  validates :text, presence: true
end
