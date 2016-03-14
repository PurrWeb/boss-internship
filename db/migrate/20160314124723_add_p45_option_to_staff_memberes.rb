class AddP45OptionToStaffMemberes < ActiveRecord::Migration
  def change
    change_table :staff_members do |t|
      t.boolean :employment_status_p45_supplied, null: false
    end
  end
end
