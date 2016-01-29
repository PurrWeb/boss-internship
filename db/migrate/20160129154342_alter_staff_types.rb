class AlterStaffTypes < ActiveRecord::Migration
  def change
    change_table :staff_types do |t|
      t.remove :creator_id
      t.string :ui_color
      t.string :role
    end
    change_column_null :staff_types, :role, false
  end
end
