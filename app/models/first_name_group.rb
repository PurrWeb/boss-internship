class FirstNameGroup < ActiveRecord::Base
  def self.enabled
    where(enabled: true)
  end
end
