class AddPayratesTable < ActiveRecord::Migration
  def change
    create_table :pay_rates do |t|
      t.string :pay_rate_type, null: false
      t.string :name
      t.string :description
      t.integer :cents_per_hour, null: false
      t.index :pay_rate_type
    end
  end
end
