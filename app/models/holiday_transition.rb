class HolidayTransition < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordTransition

  belongs_to :holiday, inverse_of: :holiday_transitions
end
