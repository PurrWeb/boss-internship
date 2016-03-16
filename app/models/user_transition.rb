class UserTransition < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordTransition

  belongs_to :user, inverse_of: :user_transitions
end
