class RemoveReminderUsersFromVenue < ActiveRecord::Migration
  def change
    drop_table :venue_reminder_users
  end
end
