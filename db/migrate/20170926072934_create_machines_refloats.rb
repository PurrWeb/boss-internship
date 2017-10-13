class CreateMachinesRefloats < ActiveRecord::Migration
  def change
    create_table :machines_refloats do |t|
      t.references :user, null: false, index: true
      t.references :machine, null: false, index: true
      t.integer :refill_x_10p, null: false
      t.integer :cash_in_x_10p, null: false
      t.integer :cash_out_x_10p, null: false
      t.integer :float_topup_cents, null: false
      t.string :float_topup_note
      t.integer :money_banked_cents, null: false
      t.string :money_banked_note
      t.integer :calculated_float_topup_cents, null: false
      t.integer :calculated_money_banked_cents, null: false

      t.timestamps
    end
  end
end
