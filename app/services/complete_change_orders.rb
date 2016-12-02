class CompleteChangeOrders
  def initialize(requester:, change_orders:)
    @requester = requester
    @change_orders = change_orders
  end
  attr_reader :requester, :change_orders

  def call
    ActiveRecord::Base.transaction do
      change_orders.each do |change_order|
        change_order.state_machine.transition_to!(
          :done,
          requster_user_id: requester.id
        )
      end
    end
  end
end
