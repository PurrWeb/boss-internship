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

  def enable
    update_attributes enabled: true
  end

  def disable
    update_attributes enabled: false
  end

  def enable!
    update_attributes! enabled: true
  end

  def disable!
    update_attributes! enabled: false
  end
end
