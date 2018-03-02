class PaymentTransition < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordTransition


  belongs_to :payment, inverse_of: :payment_transitions
end
