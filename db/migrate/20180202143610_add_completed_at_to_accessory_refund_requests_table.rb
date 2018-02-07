class AddCompletedAtToAccessoryRefundRequestsTable < ActiveRecord::Migration
  def change
    add_column :accessory_refund_requests, :completed_at, :datetime, default: nil
  end
end
