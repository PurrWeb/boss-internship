class AddFruitOrders < ActiveRecord::Migration
  def change
    create_table :fruit_orders do |t|
      t.integer :venue_id, null: false

      t.integer :limes, null: false
      t.integer :lemons, null: false
      t.integer :rasberries, null: false
      t.integer :blueberries, null: false
      t.integer :blackberries, null: false
      t.integer :green_apples, null: false
      t.integer :oranges, null: false
      t.integer :passion_fruits, null: false
      t.integer :lychees, null: false
      t.integer :cucumbers, null: false
      t.integer :kumkwats, null: false
      t.integer :dragon_fruits, null: false
      t.integer :watermelon, null: false
      t.integer :pink_grapefruit, null: false
      t.integer :plums, null: false
      t.integer :deskinned_coconuts, null: false
      t.integer :fresh_mint, null: false
      t.integer :fresh_basil, null: false
      t.integer :fresh_lavender, null: false
      t.integer :rosemary, null: false
      t.integer :thyme, null: false
      t.integer :red_roses, null: false
      t.integer :kaffir_lime_leaves, null: false
      t.integer :fresh_ginger, null: false
      t.integer :bananas, null: false
      t.integer :maraschino_cherry, null: false
      t.integer :cream, null: false

      t.timestamps

      t.index :venue_id
    end
  end
end
