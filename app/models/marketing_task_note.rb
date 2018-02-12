class MarketingTaskNote < ActiveRecord::Base
  include Noteable

  # Associations
  belongs_to :marketing_task
end
