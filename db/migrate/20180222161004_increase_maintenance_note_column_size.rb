class IncreaseMaintenanceNoteColumnSize < ActiveRecord::Migration
  def change
    change_column :maintenance_task_notes, :note, :text
  end
end
