class AddDeleteFieldsToSecurityRequests < ActiveRecord::Migration
  def change
    change_table :security_shift_requests do |t|
      t.integer :deleted_by_id
      t.datetime :deleted_at
      t.index :deleted_at
    end
  end
end
