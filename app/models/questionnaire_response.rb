class QuestionnaireResponse < ActiveRecord::Base
  # Associations
  belongs_to :questionnaires
  belongs_to :venue
  belongs_to :user
  has_many :questionnaire_answers, dependent: :destroy
  accepts_nested_attributes_for :questionnaire_answers

  validates :venue, presence: true
end
