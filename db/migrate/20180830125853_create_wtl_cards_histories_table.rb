class CreateWtlCardsHistoriesTable < ActiveRecord::Migration
  def change
    create_table :wtl_cards_histories do |t|
      t.references :wtl_card, null: false, index: true
      t.references :wtl_client, index: true
      t.references :user, index: true
      t.timestamps null: false
    end
  end
end
