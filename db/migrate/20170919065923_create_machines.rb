class CreateMachines < ActiveRecord::Migration
  def change
    create_table :machines do |t|
      t.references :created_by_user, references: :users, null: false, index: true
      t.references :venue, null: false, foreign_key: true, index: true
      t.string :name, null: false
      t.string :location, null: false
      t.integer :float_cents, null: false
      t.integer :initial_refill_x_10p, null: false
      t.integer :initial_cash_in_x_10p, null: false
      t.integer :initial_cash_out_x_10p, null: false
      t.datetime :disabled_at
      t.references :disabled_by, references: :users, index: true

      t.timestamps
    end
    add_foreign_key :machines, :users, column: :disabled_by_id
    add_foreign_key :machines, :users, column: :created_by_user_id
    
  end
end
