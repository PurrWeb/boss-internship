class FruitOrderTransition < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordTransition


  belongs_to :fruit_order, inverse_of: :fruit_order_transitions
end
