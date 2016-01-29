class SeedStaffTypes < ActiveRecord::Migration
  def change
    ActiveRecord::Base.transaction do
      StaffType.delete_all
      normal_staff_type_names.each do |staff_type_name|
        StaffType.create!(name: staff_type_name, role: 'normal')
      end
      StaffType.create!(name: 'Security', role: 'security')
    end
  end

  def normal_staff_type_names
    ['Bar Back', 'Chef', 'KP', 'Bartender' 'PR', 'Floor Staff', 'Waitress', 'Bar Supervisor', 'Manager', 'GM', 'HQ']
  end
end
