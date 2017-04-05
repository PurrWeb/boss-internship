class Questionnaire < ActiveRecord::Base
  # Associations
  has_and_belongs_to_many :venues
  has_and_belongs_to_many :questionnaire_categories
  has_many :questionnaire_questions
end
