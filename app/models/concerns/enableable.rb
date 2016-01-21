module Enableable
  extend ActiveSupport::Concern

  module ClassMethods
    def enabled
      where(enabled: true)
    end

    def disabled
      where(enabled: false)
    end
  end

  def disabled?
    !enabled?
  end
end
