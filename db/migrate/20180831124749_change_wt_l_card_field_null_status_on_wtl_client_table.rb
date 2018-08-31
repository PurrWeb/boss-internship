class ChangeWtLCardFieldNullStatusOnWtlClientTable < ActiveRecord::Migration
  def change
    change_column :wtl_clients, :wtl_card_id, :integer, null: true
  end
end
