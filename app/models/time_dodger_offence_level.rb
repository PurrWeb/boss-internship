class TimeDodgerOffenceLevel < ActiveRecord::Base
  belongs_to :staff_member
  has_many :time_dodger_review_actions
end
