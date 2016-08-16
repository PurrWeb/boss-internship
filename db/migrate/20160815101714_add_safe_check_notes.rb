class AddSafeCheckNotes < ActiveRecord::Migration
  def change
    create_table :safe_check_notes do |t|
      t.integer :created_by_user_id, null: false
      t.datetime :disabled_at
      t.integer :disabled_by_user_id
      t.integer :safe_check_id, null: false
      t.string :note_left_by_note, null: false
      t.text :note_text, null: false
      t.timestamps
    end
  end
end
