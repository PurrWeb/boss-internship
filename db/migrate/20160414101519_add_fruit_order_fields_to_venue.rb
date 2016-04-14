class AddFruitOrderFieldsToVenue < ActiveRecord::Migration
  def change
    change_table :venues do |t|
      t.text "fruit_order_fields"
    end
  end
end
