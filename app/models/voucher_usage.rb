class VoucherUsage < ActiveRecord::Base
  belongs_to :voucher
  belongs_to :creator, class_name: 'User', foreign_key: :user_id
  belongs_to :staff_member

  validates :creator, presence: true
  validates :voucher, presence: true
  validates :staff_member, presence: true
  validates :enabled, inclusion: { in: [true, false], message: 'is required' }
end
