class RotaShift < ActiveRecord::Base
  belongs_to :creator, class_name: "User"
  belongs_to :staff_member
  belongs_to :rota

  validates :creator, presence: true
  validates :staff_member, presence: true
  validates :rota, presence: true
  validates :starts_at, presence: true
  validates :ends_at, presence: true
end
