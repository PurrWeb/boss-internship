class Questionnaire < ActiveRecord::Base
  # Associations
  has_and_belongs_to_many :venues
end
