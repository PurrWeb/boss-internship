class QuestionnaireQuestion < ActiveRecord::Base
  # Associations
  belongs_to :questionnaire_category
  belongs_to :questionnaire_area
  belongs_to :questionnaire
  has_many :questionnaire_answers

  # Validations
  validates :text, presence: true
  validates :questionnaire, presence: true
  validates :questionnaire_category, presence: true
  validates :questionnaire_area, presence: true

  def self.required
    where(type: 'RequiredQuestion')
  end
end
