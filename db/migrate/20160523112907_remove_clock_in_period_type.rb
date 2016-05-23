class RemoveClockInPeriodType < ActiveRecord::Migration
  def change
    change_table :clock_in_periods do |t|
      t.remove :period_type
    end
  end
end
