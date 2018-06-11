class AddSageIdToStaffMembers < ActiveRecord::Migration
  def change
    change_table :staff_members do |t|
      t.string :sage_id
    end
  end
end
