class AddWouldRehireFlagToStaffMembers < ActiveRecord::Migration
  def change
    change_table :staff_members do |t|
      t.boolean :would_rehire, default: true, null: false
      t.index :would_rehire
    end
  end
end
