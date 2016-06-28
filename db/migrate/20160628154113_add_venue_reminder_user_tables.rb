class AddVenueReminderUserTables < ActiveRecord::Migration
  def change
    create_table :venue_reminder_users do |t|
      t.integer :venue_id, null: false
      t.integer :user_id, null: false
      t.timestamps
    end
  end
end
