class AddHolidaysTable < ActiveRecord::Migration
  def change
    create_table :holidays do |t|
      t.date :start_date, null: false
      t.date :end_date, null: false
      t.string :holiday_type, null: false
      t.integer :creator_user_id, null: false
      t.integer :staff_member_id, null: false
      t.text :note
      t.timestamps

      t.index :start_date
      t.index :end_date
      t.index :holiday_type
      t.index :staff_member_id
    end
  end
end
