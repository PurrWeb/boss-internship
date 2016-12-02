# Marks all passed in fruit orders as done
class CompleteFruitOrders
  def initialize(requester:, fruit_orders:)
    @requester = requester
    @fruit_orders = fruit_orders
  end
  attr_reader :requester, :fruit_orders

  def call
    ActiveRecord::Base.transaction do
      fruit_orders.each do |fruit_order|
        fruit_order.state_machine.transition_to!(
          :done,
          requster_user_id: requester.id
        )
      end
    end
  end
end
