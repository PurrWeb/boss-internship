class AddCompletedAtToAccessoryRequestsTable < ActiveRecord::Migration
  def change
    add_column :accessory_requests, :completed_at, :datetime, default: nil
  end
end
