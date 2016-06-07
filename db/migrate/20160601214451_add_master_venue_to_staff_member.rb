class AddMasterVenueToStaffMember < ActiveRecord::Migration
  def change
    change_table :staff_members do |t|
      t.integer :master_venue_id
    end

    total = 0
    fudged_ids = []

    ActiveRecord::Base.transaction do
      StaffMember.select do |staff_member|
        staff_member.staff_member_venues.count > 0
      end.each do |staff_member|
        if staff_member.staff_member_venues.count > 1
          fudged_ids << staff_member.id
        end

        staff_member_venue = staff_member.staff_member_venues.first
        staff_member.update_attribute(:master_venue_id, staff_member_venue.venue_id)
        staff_member_venue.destroy!

        total = total + 1
      end
    end

    puts "#{total} staff members processed "
    puts
    print "fudged ids: ["
    fudged_ids.each_with_index do |id, index|
      if index != 0
        print ", "
      end
      print id.to_s
    end
    print "]"
    puts
  end
end
