class PatchUndeletedHolidays < ActiveRecord::Migration
  def change
    user = User.first

    holidays_patched = 0
    ActiveRecord::Base.transaction do
      disabled_staff_members = StaffMember.in_state(:disabled)

      disabled_staff_members.find_each do |staff_member|
        holidays = Holiday.
          in_state(:enabled).
          where(
            staff_member: staff_member
          ).
          where(
            "start_date >= ?",
            RotaShiftDate.to_rota_date(staff_member.disabled_at)
          )

        holidays.find_each do |holiday|
          holiday.disable!(requester: user)
          holidays_patched += 1
        end
      end
      puts "#{holidays_patched} holidays patched"
    end
  end
end
