class RenameOldHoursTable < ActiveRecord::Migration
  def change
    rename_table(:old_hours, :owed_hours)
    change_table :owed_hours do |t|
      t.rename :parent_old_hour_id, :parent_owed_hour_id
    end
  end
end
