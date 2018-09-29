class WtlCard < ActiveRecord::Base
  include SearchCop

  search_scope :search do
    attributes :number
  end

  has_paper_trail

  enum state: [:disabled, :enabled]

  # Validations
  validates :number, presence: true
  validates :state, presence: true
end
