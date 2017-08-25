class CreateIncidentReports < ActiveRecord::Migration
  def change
    create_table :incident_reports do |t|
      t.references :user, null: false, foreign_key: true, index: true
      t.references :venue, null: false, foreign_key: true, index: true
      t.datetime :time, null: false
      t.string :location, null: false
      t.string :description, null: false
      t.text :involved_witness_details, null: false
      t.text :uninvolved_witness_details
      t.text :police_officer_details
      t.string :recorded_by_name, null: false
      t.string :camera_name, null: false
      t.text :report_text, null: false
      t.datetime :disabled_at
      t.references :disabled_by, references: :users, index: true

      t.timestamps
    end

    add_foreign_key :incident_reports, :users, column: :disabled_by_id
  end
end
