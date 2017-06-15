class AddPincodeSaltAndHashToStaffMember < ActiveRecord::Migration
  def change
    add_column :staff_members, :pin_code_hash, :string
    add_column :staff_members, :pin_code_salt, :string

    StaffMember.transaction do
      StaffMember.find_each do |staff_member|
        staff_member.pin_code = staff_member[:pin_code]
        staff_member.save!
      end
    end

    remove_column :staff_members, :pin_code, :string
  end
end
