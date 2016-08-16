class AddFloatsToVenues < ActiveRecord::Migration
  def change
    change_table :venues do |t|
      t.integer :till_float_cents
      t.integer :safe_float_cents
    end

    Venue.update_all(
      till_float_cents: 0,
      safe_float_cents: 0
    )

    change_column_null :venues, :till_float_cents, false
    change_column_null :venues, :safe_float_cents, false
  end
end
