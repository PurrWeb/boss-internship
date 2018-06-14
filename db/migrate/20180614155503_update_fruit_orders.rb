class UpdateFruitOrders < ActiveRecord::Migration
  def change
    change_table :fruit_orders do |t|
      t.integer :green_grapes
      t.integer :red_grapes
    end

    FruitOrder.update_all(
      green_grapes: 0,
      red_grapes: 0
    )

    change_column_null :fruit_orders, :green_grapes, false
    change_column_null :fruit_orders, :red_grapes, false
  end
end
