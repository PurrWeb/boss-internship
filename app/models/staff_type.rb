class StaffType < ActiveRecord::Base
  validates :name, presence: true
end

