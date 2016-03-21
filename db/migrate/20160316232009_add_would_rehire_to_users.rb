class AddWouldRehireToUsers < ActiveRecord::Migration
  def change
    change_table :users do |t|
      t.boolean :would_rehire, null: false, default: true
      t.index :would_rehire
    end
  end
end
