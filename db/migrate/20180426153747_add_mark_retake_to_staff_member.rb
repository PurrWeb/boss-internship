class AddMarkRetakeToStaffMember < ActiveRecord::Migration
  def change
    change_table :staff_members do |t|
      t.datetime :marked_retake_avatar_at, null: true, default: nil
      t.integer :marked_retake_avatar_user_id, null: true, default: nil
      t.boolean :override_retake_avatar_restrictions, default: false, null: false
    end
  end
end
