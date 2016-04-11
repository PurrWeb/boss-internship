class ChangeOrderTransition < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordTransition


  belongs_to :change_order, inverse_of: :change_order_transitions
end
