class Payment < ActiveRecord::Base
  belongs_to :staff_member
  belongs_to :created_by_user, class_name: "User", foreign_key: 'created_by_user_id'
  belongs_to :disabled_by_user, class_name: 'User', foreign_key: 'disabled_by_user_id'

  validates :staff_member, presence: true
  validates :created_by_user, presence: true
  validates :date, presence: true
  validates :cents, presence: true
end
