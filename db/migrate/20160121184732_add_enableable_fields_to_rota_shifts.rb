class AddEnableableFieldsToRotaShifts < ActiveRecord::Migration
  def change
    change_table :rota_shifts do |t|
      t.boolean :enabled, default: true, null: false
      t.datetime :disabled_at
      t.integer :disabled_by_user_id
      t.index :enabled
    end
  end
end
