class QuestionnaireResponse < ActiveRecord::Base
  # Associations
  belongs_to :questionnaires
  belongs_to :user
  has_many :answers
end
