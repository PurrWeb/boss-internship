class AddSafeCheckNoteIndex < ActiveRecord::Migration
  def change
    add_index :safe_check_notes, :safe_check_id
  end
end
