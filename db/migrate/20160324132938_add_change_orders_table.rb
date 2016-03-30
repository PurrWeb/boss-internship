class AddChangeOrdersTable < ActiveRecord::Migration
  def change
    create_table :change_orders do |t|
      t.date :date, null: false
      t.integer :venue_id, null: false
      t.integer :five_pound_notes, null: false
      t.integer :one_pound_coins, null: false
      t.integer :fifty_pence_coins, null: false
      t.integer :twenty_pence_coins, null: false
      t.integer :ten_pence_coins, null: false
      t.integer :five_pence_coins, null: false
      t.timestamps

      t.index :date
    end
  end
end
