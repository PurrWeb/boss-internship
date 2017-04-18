class QuestionnaireResponse < ActiveRecord::Base
  # Associations
  belongs_to :questionnaires
  belongs_to :user
  has_many :questionnaire_answers
  accepts_nested_attributes_for :questionnaire_answers
end
