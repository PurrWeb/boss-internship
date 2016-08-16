class AddSafeChecks < ActiveRecord::Migration
  def change
    create_table :safe_checks do |t|
      t.integer :venue_id, null: false
      t.integer :creator_user_id, null: false
      t.string  :checked_by_note, null: false

      t.integer :fifty_pound_note_pounds, null: false
      t.integer :twenty_pound_note_pounds, null: false
      t.integer :ten_pound_note_pounds, null: false
      t.integer :five_pound_note_pounds, null: false
      t.integer :two_pound_coins_pounds, null: false
      t.integer :one_pound_coins_pounds, null: false
      t.integer :fifty_pence_coins_cents, null: false
      t.integer :twenty_pence_coins_cents, null: false
      t.integer :ten_pence_coins_cents, null: false
      t.integer :five_pence_coins_cents, null: false
      t.integer :coppers_cents, null: false
      t.integer :safe_float_cents, null: false
      t.integer :till_float_cents, null: false
      t.integer :out_to_order_cents, null: false
      t.integer :other_cents, null: false
      t.timestamps

      t.index [:created_at, :venue_id]
    end
  end
end
