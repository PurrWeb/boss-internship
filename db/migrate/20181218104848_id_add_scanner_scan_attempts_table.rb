class IdAddScannerScanAttemptsTable < ActiveRecord::Migration
  def change
    create_table :id_scanner_scan_attempts do |t|
      t.integer :id_scanner_app_api_key_id, null: false
      t.string :guid, null: false
      t.string :status, null: false
      t.integer :linked_staff_member_id
      t.timestamps

      t.index [:guid, :id_scanner_app_api_key_id], name: 'guid_scanner_key_history'
      t.index [:status, :id_scanner_app_api_key_id], name: "status_scanner_key_history"
    end
  end
end
