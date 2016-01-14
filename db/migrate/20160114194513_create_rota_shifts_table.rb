class CreateRotaShiftsTable < ActiveRecord::Migration
  def change
    create_table :rota_shifts do |t|
      t.integer :creator_id
      t.index :creator_id
      t.datetime :starts_at
      t.index :starts_at
      t.datetime :ends_at
      t.index :ends_at
      t.integer :staff_member_id
      t.index :staff_member_id
      t.integer :rota_id
      t.index :rota_id
      t.timestamps null: false
    end

    change_column_null :rota_shifts, :starts_at, false
    change_column_null :rota_shifts, :ends_at, false
    change_column_null :rota_shifts, :staff_member_id, false
    change_column_null :rota_shifts, :rota_id, false
  end
end
