class CreateWtlCardsTable < ActiveRecord::Migration
  def change
    create_table :wtl_cards do |t|
      t.string :number, null: false, unique: true, index: true
      t.integer :state, null: false, default: 1
      t.timestamps null: false
    end
  end
end
