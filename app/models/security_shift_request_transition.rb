class SecurityShiftRequestTransition < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordTransition

  belongs_to :security_shift_request, inverse_of: :security_shift_request_transitions
end
