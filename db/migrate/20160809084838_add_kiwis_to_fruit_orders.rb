class AddKiwisToFruitOrders < ActiveRecord::Migration
  def change
    change_table :fruit_orders do |t|
      t.integer :kiwi_fruits
    end

    FruitOrder.update_all(
      kiwi_fruits: 0
    )
    change_column_null :fruit_orders, :kiwi_fruits, false
  end
end
