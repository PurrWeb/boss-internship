module Disableable
  extend ActiveSupport::Concern

  included do
    validates :disabled_at, :disabled_by_user, presence: true, if: :disabled?
  end

  def disabled?
    disabled_at.present? || disabled_by_user.present?
  end
end
