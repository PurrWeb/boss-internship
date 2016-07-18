class AddEggsToFruitOrder < ActiveRecord::Migration
  def change
    change_table :fruit_orders do |t|
      t.integer "eggs"
    end

    FruitOrder.update_all(eggs: 0)

    change_column_null :fruit_orders, :eggs, false
  end
end
