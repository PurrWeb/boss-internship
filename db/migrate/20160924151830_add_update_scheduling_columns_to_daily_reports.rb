class AddUpdateSchedulingColumnsToDailyReports < ActiveRecord::Migration
  def change
    change_table :daily_reports do |t|
      t.datetime :last_update_requested_at
      t.datetime :last_update_request_serviced
      t.remove :update_required
    end
  end
end
