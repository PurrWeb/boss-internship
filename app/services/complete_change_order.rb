class CompleteChangeOrder
  def initialize(requester:, change_order:)
    @requester = requester
    @change_order = change_order
  end
  attr_reader :requester, :change_order

  def call
    change_order.state_machine.transition_to!(
      :done,
      requster_user_id: requester.id
    )
  end
end
