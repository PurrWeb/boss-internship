class Voucher < ActiveRecord::Base
  belongs_to :creator, class_name: 'User', foreign_key: "user_id"
  belongs_to :venue
  has_many :voucher_usages

  validates :creator, presence: true
  validates :venue, presence: true
  validates :description, presence: true
  validates :enabled, inclusion: { in: [true, false], message: 'is required' }

  def self.enabled
    where(enabled: true)
  end
end
