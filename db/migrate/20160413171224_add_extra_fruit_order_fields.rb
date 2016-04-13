class AddExtraFruitOrderFields < ActiveRecord::Migration
  def change
    change_table :fruit_orders do |t|
      t.integer :sharon_fruits
      t.integer :figs
      t.integer :blood_oranges
      t.integer :pomegranates
      t.integer :pineapples
    end

    FruitOrder.update_all(
      sharon_fruits: 0,
      figs: 0,
      blood_oranges: 0,
      pomegranates: 0,
      pineapples: 0
    )
    change_column_null :fruit_orders, :sharon_fruits, false
    change_column_null :fruit_orders, :figs, false
    change_column_null :fruit_orders, :blood_oranges, false
    change_column_null :fruit_orders, :pomegranates, false
    change_column_null :fruit_orders, :pineapples, false
  end
end
