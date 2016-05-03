class AddClockInNotes < ActiveRecord::Migration
  def change
    create_table :clock_in_notes do |t|
      t.integer :creator_id, null: false
      t.string :creator_type, null: false
      t.string :note, null: false
      t.integer :venue_id, null: false
      t.integer :staff_member_id, null: false
      t.date :date, null: false
      t.boolean :enabled, default: true, null: false
      t.timestamps
    end
  end
end
