class RemoveClockInReason < ActiveRecord::Migration
  def change
    change_table :clock_in_periods do |t|
      t.remove :clock_in_period_reason_id
      t.remove :reason_note
    end

    drop_table :clock_in_period_reasons
  end
end
