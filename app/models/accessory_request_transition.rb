class AccessoryRequestTransition < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordTransition

  belongs_to :accessory_request, inverse_of: :accessory_request_transitions
end