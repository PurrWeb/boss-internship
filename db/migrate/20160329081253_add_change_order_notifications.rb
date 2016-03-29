class AddChangeOrderNotifications < ActiveRecord::Migration
  def change
    create_table :change_order_notifications do |t|
      t.integer :venue_id, null: false
      t.index :venue_id
      t.timestamps
    end
  end
end
