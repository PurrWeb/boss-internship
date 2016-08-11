class AddStaffTrackingEvents < ActiveRecord::Migration
  def change
    create_table :staff_tracking_events do |t|
      t.datetime :at, null: false
      t.string :event_type, null: false
      t.integer  :staff_member_id, null: :false
      t.timestamps
      t.index [:at, :event_type]
    end

    StaffMember.find_each do |staff_member|
      StaffTrackingEvent.create!(
        at: staff_member.created_at,
        staff_member: staff_member,
        event_type: 'creation'
      )

      if staff_member.disabled?
        StaffTrackingEvent.create!(
          at: staff_member.disabled_at,
          staff_member: staff_member,
          event_type: 'disable'
        )
      end
    end
  end
end
