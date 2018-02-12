module Noteable
  extend ActiveSupport::Concern

  included do
    belongs_to :creator_user, class_name: 'User'
    belongs_to :disabled_by_user, class_name: 'User'

    # Validations
    validates :note, presence: true
    validates :disabled_at, :disabled_by_user, presence: true, if: :disabled?
  end

  def disabled?
    disabled_at.present? || disabled_by_user.present?
  end
end
