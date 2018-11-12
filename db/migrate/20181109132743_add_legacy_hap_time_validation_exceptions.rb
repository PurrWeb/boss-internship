class AddLegacyHapTimeValidationExceptions < ActiveRecord::Migration
  def change
    change_table :hours_acceptance_periods do |t|
      t.boolean :allow_legacy_seconds_in_times, null: false, default: false
    end

    change_table :hours_acceptance_breaks do |t|
      t.boolean :allow_legacy_seconds_in_times, null: false, default: false
    end
  end
end
