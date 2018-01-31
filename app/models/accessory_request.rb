class AccessoryRequest < ActiveRecord::Base
  has_paper_trail :only => [:status]

  belongs_to :staff_member
  belongs_to :accessory

  enum accessory_type: [:misc, :uniform]
  enum status: [:pending, :accepted, :rejected]

  validates :accessory_type, presence: true
  validates :price_cents, presence: true
  validates :status, presence: true
  validates :accessory, presence: true
  validates :staff_member, presence: true
  validates :size, presence: true, if: :uniform?
end
