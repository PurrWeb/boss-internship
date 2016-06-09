class LinkNotesToClockInDay < ActiveRecord::Migration
  def change
    change_table :clock_in_notes do |t|
      t.integer :clock_in_day_id
    end

    ActiveRecord::Base.transaction do
      ClockInNote.find_each do |note|
        day = ClockInDay.find_or_create_by!(
          staff_member: note.staff_member,
          venue: note.venue,
          date: note.date,
          creator: User.first
        )

        note.update_attribute(clock_in_day_id: day.id)
      end

      change_column_null :clock_in_notes, :clock_in_day_id, false
    end


    change_table :clock_in_notes do |t|
      t.remove :venue_id
      t.remove :staff_member_id
      t.remove :date
    end
  end
end
