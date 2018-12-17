class AddIdScannerAppModels < ActiveRecord::Migration
  def change
    create_table :id_scanner_app_api_keys do |t|
      t.integer :creator_user_id, null: false
      t.string :key, null: false
      t.string :name, null: false
      t.datetime :disabled_at
      t.integer :disabled_by_user_id
      t.timestamps
    end
  end
end
