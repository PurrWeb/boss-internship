class AddStrawberriesToFruitOrders < ActiveRecord::Migration
  def change
    change_table :fruit_orders do |t|
      t.integer :strawberries
    end

    FruitOrder.update_all(
      strawberries: 0
    )
    change_column_null :fruit_orders, :strawberries, false
  end
end
