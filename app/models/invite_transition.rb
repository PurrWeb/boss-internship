class InviteTransition < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordTransition

  belongs_to :invite, inverse_of: :invite_transitions
end
