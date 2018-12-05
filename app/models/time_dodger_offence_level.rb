class TimeDodgerOffenceLevel < ActiveRecord::Base
  belongs_to :staff_member
  has_many :time_dodger_review_actions

  validates :staff_member, presence: true
  validates :offence_level, presence: true
  validates :review_level, presence: true
  validates :tax_year_start, presence: true
end
