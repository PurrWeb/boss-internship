class AddOldHours < ActiveRecord::Migration
  def change
    create_table :old_hours do |t|
      t.date :week_start_date, null: false
      t.integer :minutes, null: false
      t.integer :creator_user_id, null: false
      t.integer :staff_member_id, null: false
      t.text :note, null: false
      t.integer :parent_old_hour_id
      t.datetime :disabled_at
      t.integer :disabled_by_user_id
      t.integer :parent_old_hour_id
      t.timestamps
    end
  end
end
