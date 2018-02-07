class CreateAccessories < ActiveRecord::Migration
  def change
    create_table :accessories do |t|
      t.references :venue
      t.integer :accessory_type
      t.string :name
      t.integer :price_cents
      t.string :size
      t.boolean :user_requestable
      t.datetime :disabled_at

      t.timestamps null: false
    end
  end
end
