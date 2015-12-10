class AddPinCodeToStaffMember < ActiveRecord::Migration
  def change
    change_table :staff_members do |t|
      t.string :pin_code
    end

    change_column_null :staff_members, :pin_code, false
  end
end
