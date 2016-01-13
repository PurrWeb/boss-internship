class StaffType < ActiveRecord::Base
  belongs_to :creator, class_name: "User"

  validates :name, presence: true, uniqueness: true
  validates :creator, presence: true
end

