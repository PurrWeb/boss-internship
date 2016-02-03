class AddEmploymentStatusCheckboxes < ActiveRecord::Migration
  def change
    change_table :staff_members do |t|
      t.boolean :employment_status_a
      t.boolean :employment_status_b
      t.boolean :employment_status_c
      t.boolean :employment_status_d
    end

    StaffMember.update_all(
      employment_status_a: true,
      employment_status_b: false,
      employment_status_c: false,
      employment_status_d: false
    )

    change_column_null :staff_members, :employment_status_a, false
    change_column_null :staff_members, :employment_status_b, false
    change_column_null :staff_members, :employment_status_c, false
    change_column_null :staff_members, :employment_status_d, false
  end
end
