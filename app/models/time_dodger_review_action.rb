class TimeDodgerReviewAction < ActiveRecord::Base
  belongs_to :time_dodger_offence_level
  belongs_to :creator_user, class_name: 'User'
  belongs_to :disabled_by_user, class_name: 'User'

  validates :note, presence: true
end
