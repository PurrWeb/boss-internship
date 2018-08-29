class WtlCard < ActiveRecord::Base
  has_paper_trail

  enum state: [:disabled, :enabled]

  # Validations
  validates :number, presence: true
  validates :state, presence: true
end
