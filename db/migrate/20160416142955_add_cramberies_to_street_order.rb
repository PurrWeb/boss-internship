class AddCramberiesToStreetOrder < ActiveRecord::Migration
  def change
    change_table :fruit_orders do |t|
      t.integer :cranberries
    end

    FruitOrder.update_all(
      cranberries: 0
    )
    change_column_null :fruit_orders, :cranberries, false
  end
end
