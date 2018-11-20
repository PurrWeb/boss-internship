class AddAllowNoSageIdToStaffMembers < ActiveRecord::Migration
  def change
    change_table :staff_members do |t|
      t.boolean :allow_no_sage_id, null: false, default: false
    end
  end
end
