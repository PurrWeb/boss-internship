class AddCreatedByUserToAccessoryRefundRequestsTable < ActiveRecord::Migration
  def change
    def change
      add_reference :accessory_refund_requests, :created_by_user, references: :users, index: true
      add_foreign_key :accessory_refund_requests, :users, column: :created_by_user_id
    end
  end
end
