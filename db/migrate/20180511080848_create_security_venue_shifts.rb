class CreateSecurityVenueShifts < ActiveRecord::Migration
  def change
    create_table :security_venue_shifts do |t|
      t.date :date, null: false
      t.references :staff_member, null: false, index: true, foreign_key: true
      t.references :creator_user, references: :users, null: false, index: true
      t.references :security_venue, null: false, index: true, foreign_key: true
      t.datetime :starts_at, null: false
      t.datetime :ends_at, null: false
      t.datetime :disabled_at
      t.references :disabled_by_user, references: :users, index: true

      t.timestamps null: false
    end

    add_foreign_key :security_venue_shifts, :users, column: :creator_user_id
    add_foreign_key :security_venue_shifts, :users, column: :disabled_by_user_id

  end
end
