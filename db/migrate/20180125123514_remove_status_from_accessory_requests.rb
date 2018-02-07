class RemoveStatusFromAccessoryRequests < ActiveRecord::Migration
  def change
    remove_column :accessory_requests, :status, :integer, null: false
  end
end
