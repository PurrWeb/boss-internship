class HolidayRequestTransition < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordTransition


  belongs_to :holiday_request, inverse_of: :holiday_request_transitions
end
