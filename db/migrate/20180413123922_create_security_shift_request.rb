class CreateSecurityShiftRequest < ActiveRecord::Migration
  def change
    create_table :security_shift_requests do |t|
      t.references :creator, references: :users, null: false, index: true
      t.references :created_shift, references: :rota_shifts, index: true
      t.references :venue, null: false, index: true, foreign_key: true
      t.datetime :starts_at, null: false
      t.datetime :ends_at, null: false
      t.text :note
      t.text :reject_reason
      t.timestamps null: false
    end

    add_foreign_key :security_shift_requests, :users, column: :creator_id
    add_foreign_key :security_shift_requests, :rota_shifts, column: :created_shift_id
  end
end
