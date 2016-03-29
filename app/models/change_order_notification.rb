class ChangeOrderNotification < ActiveRecord::Base
  belongs_to :venue
  validates :venue, presence: true
end
