class Accessory < ActiveRecord::Base
  include SearchCop

  search_scope :search do
    attributes :name
  end

  belongs_to :venue

  enum accessory_type: [:misc, :uniform]

  validates :name, presence: true
  validates :accessory_type, presence: true
  validates :price_cents, presence: true
  validates :user_requestable, inclusion: { in: [true, false], message: 'is required' }
  validates :size, presence: true, if: :uniform?

  scope :enabled, -> { where(disabled_at: nil) }
  scope :disabled, -> { where.not(disabled_at: nil) }

  def enabled?
    disabled_at == nil
  end

  def disabled?
    disabled_at != nil
  end
end
