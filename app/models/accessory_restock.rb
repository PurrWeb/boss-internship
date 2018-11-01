class AccessoryRestock < ActiveRecord::Base
  belongs_to :accessory
  belongs_to :accessory_request
  belongs_to :created_by_user, class_name: "User"

  validates :accessory, presence: true
  validates :created_by_user, presence: true
  validates :count, presence: true
  validates :delta, presence: true
end
