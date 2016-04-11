class RemoveChangeOrderNotificationsTable < ActiveRecord::Migration
  def change
    drop_table :change_order_notifications
  end
end
