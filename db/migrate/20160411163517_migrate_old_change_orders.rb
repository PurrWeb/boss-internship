class MigrateOldChangeOrders < ActiveRecord::Migration
  def change
    ActiveRecord::Base.transaction do
      requester = User.first

      ChangeOrder.find_each do |change_order|
        if change_order.submission_deadline < Time.now
          change_order.state_machine.transition_to!(
            :accepted,
            requster_user_id: requester.id
          )

          change_order.state_machine.transition_to!(
            :done,
            requster_user_id: requester.id
          )
        end
      end
    end
  end
end
