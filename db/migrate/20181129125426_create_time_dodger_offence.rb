class CreateTimeDodgerOffence < ActiveRecord::Migration
  def change
    create_table :time_dodger_offences do |t|
      t.references :staff_member, null: false, index: true
      t.date :week_start, null: false
      t.integer :minutes, null: false
      t.integer :accepted_hours, null: false
      t.integer :paid_holidays, null: false
      t.integer :owed_hours, null: false
      t.integer :accepted_breaks, null: false

      t.timestamps null: false
    end
  end
end
