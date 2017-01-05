class AddPoolLoftTables < ActiveRecord::Migration
  def change
    create_table :pool_loft_table_sessions do |t|
      t.string :guid, null: false
      t.integer :table_id, null: false
      t.string :table_guid, null: false
      t.string :table_name, null: false
      t.string :table_type, null: false
      t.boolean :edited_by_admin, null: false
      t.datetime :starts_at, null: false
      t.integer :duration_seconds
      t.timestamps
    end

    create_table :pool_loft_table_session_edits do |t|
      t.string :guid, null: false
      t.integer :table_session_id, null: false
      t.string :table_session_guid, null: false
      t.integer :admin_token_id, null: false
      t.string :admin_token_guid, null: false
      t.integer :old_duration_seconds, null: false
      t.integer :new_duration_seconds, null: false
      t.timestamps
    end
  end
end
