class AddDisableFieldsToHoursAcceptanceBreaks < ActiveRecord::Migration
  def change
    change_table :hours_acceptance_breaks do |t|
      t.datetime :disabled_at
      t.integer :disabled_by_id
      t.string :disabled_by_type
    end
  end
end
