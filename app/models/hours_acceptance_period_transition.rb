class HoursAcceptancePeriodTransition < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordTransition
  belongs_to :hours_acceptance_period, inverse_of: :hours_acceptance_period_transitions
end
