class AddInitialFloatTopupCents < ActiveRecord::Migration
  def change
    add_column :machines, :initial_float_topup_cents, :integer, null: false
  end
end
