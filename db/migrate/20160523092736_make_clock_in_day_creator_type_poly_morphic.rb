class MakeClockInDayCreatorTypePolyMorphic < ActiveRecord::Migration
  def change
    change_table :clock_in_periods do |t|
      t.string :creator_type
    end

    ClockInPeriod.update_all(creator_type: 'StaffMember')

    change_column_null :clock_in_periods, :creator_type, false
  end
end
