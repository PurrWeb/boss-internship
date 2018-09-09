class AddWtlModelTables < ActiveRecord::Migration
  def change
    change_table :wtl_clients do |t|
      t.string :verification_token, null: false
      t.datetime :verified_at

      t.index :verification_token, unique: true
    end
  end
end
