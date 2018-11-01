class AddReusableToAccessoryRefundRequestsTable < ActiveRecord::Migration
  def change
    add_column :accessory_refund_requests, :reusable, :boolean, null: false, default: false
  end
end
