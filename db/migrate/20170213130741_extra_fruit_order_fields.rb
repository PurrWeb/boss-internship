class ExtraFruitOrderFields < ActiveRecord::Migration
  def change
    change_table :fruit_orders do |t|
      t.integer :vanilla_pods
      t.integer :edible_flowers
    end

    FruitOrder.update_all(
      vanilla_pods: 0,
      edible_flowers: 0
    )
    change_column_null :fruit_orders, :vanilla_pods, false
    change_column_null :fruit_orders, :edible_flowers, false
  end
end
