class ApiKeyTransition < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordTransition

  belongs_to :api_key, inverse_of: :api_key_transitions
end
