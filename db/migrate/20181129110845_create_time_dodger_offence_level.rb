class CreateTimeDodgerOffenceLevel < ActiveRecord::Migration
  def change
    create_table :time_dodger_offence_levels do |t|
      t.date :tax_year_start, null: false
      t.references :staff_member, null: false, index: true
      t.integer :offence_level, null: false
      t.integer :review_level, null: false

      t.timestamps null: false
    end
  end
end
