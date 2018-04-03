class CreateHolidayRequests < ActiveRecord::Migration
  def change
    create_table :holiday_requests do |t|
      t.date :start_date
      t.date :end_date
      t.string :holiday_type
      t.integer :created_by_user_id
      t.integer :staff_member_id
      t.text :note
      t.integer :created_holiday_id
      t.timestamps
    end
  end
end
