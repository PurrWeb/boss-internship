class AccessoryRefundRequestTransition < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordTransition

  belongs_to :accessory_refund_request, inverse_of: :accessory_refund_request_transitions
end
